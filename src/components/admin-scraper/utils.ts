
export const processHtml = (
    html: string,
    url: string,
    type: 'scholarship' | 'university',
    inputMethod: 'url' | 'html'
) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Helper to resolve relative URLs
    let baseUrl = '';
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
    const ogUrl = doc.querySelector('meta[property="og:url"]')?.getAttribute('content');
    const baseTag = doc.querySelector('base')?.getAttribute('href');

    // Determine base URL from content or user input
    if (baseTag) baseUrl = baseTag;
    else if (canonical) baseUrl = new URL(canonical).origin;
    else if (ogUrl) baseUrl = new URL(ogUrl).origin;
    else if (url) {
        try { baseUrl = new URL(url).origin; } catch (e) { }
    }

    const resolveUrl = (relativeUrl: string | null | undefined) => {
        if (!relativeUrl) return '';
        if (relativeUrl.startsWith('http') || relativeUrl.startsWith('//')) return relativeUrl;
        if (!baseUrl) return relativeUrl; // Return as is if no base URL
        try {
            return new URL(relativeUrl, baseUrl).toString();
        } catch (e) { return relativeUrl; }
    };

    // 1. Basic Meta Tags & Content
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
    const siteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
    const titleTag = doc.querySelector('title')?.textContent;
    const h1 = doc.querySelector('h1')?.textContent;

    // Prioritize site name for University Name if available, otherwise title
    const finalTitle = ogTitle || twitterTitle || titleTag || h1 || '';
    const finalName = siteName || finalTitle; // For universities, site name is often better (e.g. "LUMS")

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
                if (json['@type'] === 'Organization' || json['@type'] === 'EducationalOrganization' || json['@type'] === 'CollegeOrUniversity') {
                    jsonLdData = { ...jsonLdData, ...json };
                }
                if (json['@graph']) {
                    const org = json['@graph'].find((item: any) => item['@type'] === 'Organization' || item['@type'] === 'EducationalOrganization' || item['@type'] === 'CollegeOrUniversity');
                    if (org) jsonLdData = { ...jsonLdData, ...org };
                }
            } catch (e) { console.error('JSON-LD parse error', e); }
        });
    } catch (e) { console.error('JSON-LD selector error', e); }

    // 3. Advanced Image/Icon Extraction
    // Icon: Favicon or specific logo class
    const favicon = doc.querySelector('link[rel="icon"]')?.getAttribute('href') || doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href');
    const logoImg = doc.querySelector('img[alt*="logo" i]')?.getAttribute('src') || doc.querySelector('img[class*="logo" i]')?.getAttribute('src');
    const finalIconUrl = resolveUrl(jsonLdData.logo || logoImg || favicon || '');

    // University Image: Banner, Slider, or OG Image
    // Look for lazy loaded images too (data-src)
    let bannerImage = '';
    const potentialBanners = Array.from(doc.querySelectorAll('img'));
    for (const img of potentialBanners) {
        const src = img.getAttribute('src') || img.getAttribute('data-src');
        const alt = img.getAttribute('alt') || '';
        const className = img.className || '';

        // Heuristic: Large images, or those with 'banner', 'slider', 'campus' in name/alt
        if (src && (className.includes('banner') || className.includes('slider') || alt.toLowerCase().includes('campus') || alt.toLowerCase().includes('university'))) {
            bannerImage = resolveUrl(src);
            break; // Take the first good match
        }
    }
    const finalUniImage = resolveUrl(ogImage || bannerImage || '');

    // 4. Text Content Heuristics (Fallback if JSON-LD fails)
    const bodyText = (doc.body.innerText || doc.body.textContent || '').replace(/\s+/g, ' ').trim();

    // Email Extraction
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const emails = bodyText.match(emailRegex) || [];
    // Prioritize info, admissions, contact emails
    const bestEmail = emails.find(e => e.includes('info') || e.includes('admission') || e.includes('contact')) || emails[0] || '';

    // Phone Extraction (simple pattern for now)
    const phoneRegex = /(\+92|0)?\s?3[0-9]{2}\s?[0-9]{7}|(\+92|0)?\s?[0-9]{2,3}\s?[0-9]{6,8}/g;
    const phones = bodyText.match(phoneRegex) || [];
    const bestPhone = phones[0] || '';

    // City & Address Extraction
    // List of major Pakistani cities to check for
    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'];
    let foundCity = '';
    let foundAddress = '';

    // 1. Look for "Address:" keyword
    const addressKeywordMatch = bodyText.match(/Address\s*[:|-]\s*(.{10,100})/i);
    if (addressKeywordMatch) {
        foundAddress = addressKeywordMatch[1].trim();
        // Check if any city is in this address
        foundCity = cities.find(c => foundAddress.toLowerCase().includes(c.toLowerCase())) || '';
    }

    // 2. If no address found, look for city in footer or contact sections
    if (!foundCity) {
        // Search in common footer classes
        const footer = doc.querySelector('footer') || doc.querySelector('.footer') || doc.querySelector('#footer') || doc.body;
        const footerText = footer.innerText || footer.textContent || '';

        foundCity = cities.find(c => footerText.includes(c)) || '';

        if (foundCity) {
            // Try to grab the line containing the city as the address
            const lines = footerText.split('\n');
            const addressLine = lines.find(line => line.includes(foundCity) && line.length < 150); // Avoid huge blocks
            if (addressLine) foundAddress = addressLine.trim();
        }
    }

    // Final values (JSON-LD > Heuristics)
    const finalCity = jsonLdData?.address?.addressLocality || foundCity;
    const finalAddress = (typeof jsonLdData?.address === 'string' ? jsonLdData.address : jsonLdData?.address?.streetAddress) || foundAddress;
    const finalEmail = jsonLdData.email || bestEmail;
    const finalPhone = jsonLdData.telephone || bestPhone;

    // Website URL
    const finalWebsite = resolveUrl(jsonLdData.url || ogUrl || canonical || (inputMethod === 'url' ? url : ''));

    if (type === 'scholarship') {
        return {
            title: finalTitle,
            provider: jsonLdData.name || siteName || '',
            amount: '',
            eligibility: '',
            deadline: '',
            program_level: '',
            link: finalWebsite,
            description: finalDesc,
            disciplines: '',
            documents_required: '',
            image_url: finalUniImage,
        };
    } else {
        return {
            name: jsonLdData.name || finalName,
            city: finalCity,
            address: finalAddress,
            website: finalWebsite,
            tuition_range: '',
            ranking: '',
            description: finalDesc,
            apply_link: finalWebsite,
            contact_email: finalEmail,
            contact_phone: finalPhone,
            disciplines: '',
            programs: '',
            icon_url: finalIconUrl,
            university_images: finalUniImage ? [finalUniImage] : [''],
        };
    }
};
