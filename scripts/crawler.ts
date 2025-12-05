
import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';

import { fileURLToPath } from 'url';

// Configuration
const TARGET_URL = 'https://nu.edu.pk/'; // Default test URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOT_DIR = path.join(__dirname, '../screenshots');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

interface ScrapedData {
    title: string;
    description: string;
    image_url: string;
    icon_url: string;
    jsonLd: any;
    heuristics: {
        email: string;
        phone: string;
        address: string;
        city: string;
        disciplines: string[];
        size: string;
    };
}

async function scrapeUrl(url: string): Promise<ScrapedData | null> {
    console.log(`Starting scrape for: ${url}`);
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for some environments
    });
    const page = await browser.newPage();

    let html = '';
    let finalUrl = url; // To track redirects if possible

    try {
        // Set a realistic user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Navigate to page
        console.log('Attempting Puppeteer navigation...');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); // Reduced timeout for faster fallback

        // Take a screenshot for debug
        const screenshotPath = path.join(SCREENSHOT_DIR, `scrape_${Date.now()}.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot saved to: ${screenshotPath}`);

        // Get HTML content
        html = await page.content();
        finalUrl = page.url();

    } catch (error) {
        console.warn('Puppeteer navigation failed (likely timeout). Falling back to simple fetch.', error);
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
            html = await response.text();
            finalUrl = response.url;
        } catch (fetchError) {
            console.error('Fallback fetch also failed:', fetchError);
            throw error; // Re-throw original or new error
        }
    } finally {
        await browser.close();
    }

    if (!html) return null;

    try {
        // Parse with JSDOM
        const dom = new JSDOM(html, { url: finalUrl });
        const doc = dom.window.document;

        // --- Extraction Logic (Ported from AdminScraper.tsx) ---

        // Helper to resolve relative URLs
        const resolveUrl = (relativeUrl: string | null | undefined) => {
            if (!relativeUrl) return '';
            if (relativeUrl.startsWith('http') || relativeUrl.startsWith('//')) return relativeUrl;
            try {
                return new URL(relativeUrl, url).toString();
            } catch (e) { return relativeUrl; }
        };

        // 1. Basic Meta Tags & Content
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
        const titleTag = doc.querySelector('title')?.textContent;
        const h1 = doc.querySelector('h1')?.textContent;
        const finalTitle = ogTitle || twitterTitle || titleTag || h1 || '';

        const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
        const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
        const finalDesc = ogDesc || metaDesc || '';

        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');

        // 2. JSON-LD Structured Data
        let jsonLdData: any = {};
        try {
            const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
            scripts.forEach(script => {
                try {
                    const content = script.textContent;
                    if (!content) return;
                    const json = JSON.parse(content);
                    // Merge if it's a relevant type
                    if (json['@type'] === 'Organization' || json['@type'] === 'EducationalOrganization' || json['@type'] === 'CollegeOrUniversity') {
                        jsonLdData = { ...jsonLdData, ...json };
                    }
                    if (json['@graph']) {
                        const org = json['@graph'].find((item: any) => item['@type'] === 'Organization' || item['@type'] === 'EducationalOrganization' || item['@type'] === 'CollegeOrUniversity');
                        if (org) jsonLdData = { ...jsonLdData, ...org };
                    }
                } catch (e) { /* ignore parse errors */ }
            });
        } catch (e) { /* ignore selector errors */ }

        // 3. Images & Icons
        const favicon = doc.querySelector('link[rel="icon"]')?.getAttribute('href') || doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href');
        const logoImg = doc.querySelector('img[alt*="logo" i]')?.getAttribute('src') || doc.querySelector('img[class*="logo" i]')?.getAttribute('src');
        const finalIconUrl = resolveUrl(jsonLdData.logo || logoImg || favicon || '');

        let bannerImage = '';
        const potentialBanners = Array.from(doc.querySelectorAll('img'));
        for (const img of potentialBanners) {
            const src = img.getAttribute('src') || img.getAttribute('data-src');
            const alt = img.getAttribute('alt') || '';
            const className = img.className || '';
            if (src && (className.includes('banner') || className.includes('slider') || alt.toLowerCase().includes('campus') || alt.toLowerCase().includes('university'))) {
                bannerImage = resolveUrl(src);
                break;
            }
        }
        const finalUniImage = resolveUrl(ogImage || bannerImage || '');

        // 4. Text Heuristics
        const bodyText = doc.body.textContent || '';

        // Email
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
        const emails = bodyText.match(emailRegex) || [];
        const bestEmail = emails.find(e => e.includes('info') || e.includes('admission') || e.includes('contact')) || emails[0] || '';

        // Phone
        const phoneRegex = /(\+92|0)?\s?3[0-9]{2}\s?[0-9]{7}|(\+92|0)?\s?[0-9]{2,3}\s?[0-9]{6,8}/g;
        const phones = bodyText.match(phoneRegex) || [];
        const bestPhone = phones[0] || '';

        // Address/City
        const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'];
        let foundCity = '';
        let foundAddress = '';

        const addressKeywordMatch = bodyText.match(/(?:Address|Location|Campus)\s*[:|-]\s*(.{10,100})/i);
        if (addressKeywordMatch) {
            foundAddress = addressKeywordMatch[1].trim();
            foundCity = cities.find(c => foundAddress.toLowerCase().includes(c.toLowerCase())) || '';
        }

        if (!foundCity) {
            // Check footer specifically
            // JSDOM doesn't support innerText perfectly like browser, but textContent is okay for simple checks
            // We might need to be careful about newlines being lost in textContent
            const footer = doc.querySelector('footer') || doc.querySelector('.footer') || doc.querySelector('#footer') || doc.body;
            const footerText = footer.textContent || '';
            foundCity = cities.find(c => footerText.includes(c)) || '';

            if (foundCity) {
                // Heuristic: Try to find a chunk of text around the city
                const index = footerText.indexOf(foundCity);
                const start = Math.max(0, index - 50);
                const end = Math.min(footerText.length, index + 100);
                foundAddress = footerText.substring(start, end).replace(/\s+/g, ' ').trim();
            }
        }

        // Disciplines Extraction
        const commonDisciplines = [
            'Computer Science', 'Software Engineering', 'Information Technology', 'Data Science', 'Artificial Intelligence',
            'Business Administration', 'Management Sciences', 'Accounting', 'Finance', 'Marketing', 'Economics',
            'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
            'Medicine', 'MBBS', 'BDS', 'Pharmacy', 'Nursing', 'Health Sciences',
            'Law', 'LLB', 'Psychology', 'Sociology', 'English', 'Education', 'Mass Communication', 'Media Studies',
            'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Biotechnology', 'Architecture', 'Design', 'Fine Arts'
        ];

        const foundDisciplines = commonDisciplines.filter(d => {
            const regex = new RegExp(`\\b${d}\\b`, 'i');
            return regex.test(bodyText);
        });

        // Size (Sq Ft / Acres) Extraction
        let foundSize = '';
        // Look for patterns like "100 acres", "500,000 sq ft", "200 kanals"
        const sizeRegex = /(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:acres|kanals|sq\.?\s*ft|square\s*feet|hectares)/i;
        const sizeMatch = bodyText.match(sizeRegex);
        if (sizeMatch) {
            foundSize = sizeMatch[0]; // Return the whole match e.g. "100 acres"
        }

        return {
            title: finalTitle,
            description: finalDesc,
            image_url: finalUniImage,
            icon_url: finalIconUrl,
            jsonLd: jsonLdData,
            heuristics: {
                email: bestEmail,
                phone: bestPhone,
                address: foundAddress,
                city: foundCity,
                disciplines: foundDisciplines,
                size: foundSize
            }
        };

    } catch (error) {
        console.error('Error parsing/extracting:', error);
        return null;
    }
}

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Export the scraper function
export { scrapeUrl };

// Run the scraper if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    (async () => {
        // Load environment variables
        const envPath = path.resolve(__dirname, '../.env');
      
        const result = dotenv.config({ path: envPath });

        if (result.error) {
            console.error('Error loading .env:', result.error);
        }

        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

       

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase credentials in .env');
            process.exit(1);
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Use the Admin UUID provided by the user
        const systemUserId = '96a23edb-4d10-4897-b576-21ff87d70aef';
        console.log('Using Admin ID for creation:', systemUserId);

        const url = process.argv[2] || TARGET_URL;
        const data = await scrapeUrl(url);

        if (data) {
           

            const universityData = {
                name: data.title,
                city: data.heuristics.city || 'Unknown',
                address: data.heuristics.address || null,
                website: url,
                description: data.description || null,
                contact_email: data.heuristics.email || null,
                contact_phone: data.heuristics.phone || null,
                icon_url: data.icon_url || null,
                images: data.image_url ? [data.image_url] : [],
                ranking: null,
                tuition_range: null,
                created_by: systemUserId,
                disciplines: data.heuristics.disciplines || [],
                size: data.heuristics.size || null
            };

            const { error } = await supabase
                .from('universities')
                .insert(universityData);

            if (error) {
                console.error('Error saving to Supabase:', error);
            } else {
                console.log('Successfully saved to Supabase!');
            }
        }
    })();
}
