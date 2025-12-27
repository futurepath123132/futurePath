
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES_DIR = path.resolve(__dirname, '../src/UNIVERSITY-IMAGES');
const BUCKET_NAME = 'university-images';

// Mapping from abbreviation to partial or full University Name to search in DB
const UNI_MAPPINGS: { [key: string]: string } = {
    'bnu': 'Beaconhouse National University',
    'bzu': 'Bahauddin Zakariya University', // Not in provided list, keeping just in case
    'cui': 'COMSATS University',
    'fc': 'Forman Christian College',
    'fjmu': 'Fatima Jinnah Medical University',
    'gc': 'Government College University',
    'hu': 'Hajvery University', // Mapped to Hajvery
    'icbs': 'Imperial College of Business Studies',
    'itu': 'Information Technology University',
    'iub': 'Islamia University of Bahawalpur',
    'kemu': 'King Edward Medical University',
    'lcwu': 'Lahore College for Women University',
    'lgu': 'Lahore Garrison University',
    'llu': 'Lahore Leads University',
    'lse': 'Lahore School of Economics',
    'lums': 'Lahore University of Management Sciences',
    'minu': 'Minhaj University',
    'nca': 'National College of Arts',
    'ntu': 'National Textile University',
    'pu': 'University of Punjab', // Corrected
    'su': 'Superior University',
    'ucp': 'University of Central Punjab',
    'uet': 'University of Engineering and Technology',
    'uhs': 'University of Health Sciences',
    'umt': 'University of Management & Technology', // Corrected &
    'uoc': 'University of Chakwal', // Mapped to Chakwal
    'uof': 'University of Faisalabad',
    'uog': 'University of Gujrat',
    'uos': 'University of Sargodha',
    'uvas': 'University of Veterinary and Animal Sciences',
};

async function seedImages() {
    console.log('Starting image seeding process...');

    // 1. Get all universities
    const { data: universities, error } = await supabase
        .from('universities')
        .select('id, name, images');

    if (error) {
        console.error('Error fetching universities:', error.message);
        return;
    }

    console.log(`Found ${universities.length} universities in database.`);

    // 2. Read images directory
    try {
        const files = fs.readdirSync(IMAGES_DIR);

        // Group files by prefix
        const filesByPrefix: { [key: string]: string[] } = {};

        files.forEach(file => {
            // Extract prefix (e.g., "bnu" from "bnu.jpeg", "bnu2.jpeg")
            const match = file.match(/^([a-z]+)\d*\.(jpg|jpeg|png|webp)$/i);
            if (match) {
                const prefix = match[1].toLowerCase();
                if (!filesByPrefix[prefix]) {
                    filesByPrefix[prefix] = [];
                }
                filesByPrefix[prefix].push(file);
            }
        });

        console.log('Found image groups:', Object.keys(filesByPrefix).join(', '));

        // 3. Process each group
        for (const [prefix, fileList] of Object.entries(filesByPrefix)) {
            const searchName = UNI_MAPPINGS[prefix];
            if (!searchName) {
                console.warn(`No mapping found for prefix: ${prefix}. Skipping...`);
                continue;
            }

            // Find university
            const university = universities.find(u => u.name.toLowerCase().includes(searchName.toLowerCase()));

            if (!university) {
                console.warn(`University not found for mapping "${searchName}" (prefix: ${prefix}). Skipping...`);
                continue;
            }

            console.log(`Processing images for ${university.name} (${prefix})...`);

            const newImageUrls: string[] = [];
            const existingImages = university.images || [];

            // Check if we already have these images (simple check by filename in URL maybe? or just append)
            // For now, I'll just append.

            // Upload images
            for (const fileName of fileList) {
                const filePath = path.join(IMAGES_DIR, fileName);
                const fileBuffer = fs.readFileSync(filePath);

                // Sanitize name for folder
                const safeName = university.name.replace(/[^a-zA-Z0-9-_]/g, "_");
                const storagePath = `${safeName}/${Date.now()}_${fileName}`;

                console.log(`Uploading ${fileName} to ${storagePath}...`);

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(storagePath, fileBuffer, {
                        contentType: getContentType(fileName),
                        upsert: true
                    });

                if (uploadError) {
                    console.error(`Failed to upload ${fileName}:`, uploadError.message);
                    continue;
                }

                const { data: publicUrlData } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(storagePath);

                newImageUrls.push(publicUrlData.publicUrl);
            }

            if (newImageUrls.length > 0) {
                const updatedImages = [...existingImages, ...newImageUrls];
                // Remove duplicates
                const uniqueImages = [...new Set(updatedImages)];

                const { error: updateError } = await supabase
                    .from('universities')
                    .update({ images: uniqueImages })
                    .eq('id', university.id);

                if (updateError) {
                    console.error(`Failed to update database for ${university.name}:`, updateError.message);
                } else {
                    console.log(`Successfully updated ${university.name} with ${newImageUrls.length} new images.`);
                }
            }
        }

    } catch (err) {
        console.error('Error reading images directory:', err);
    }
}

function getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.webp': return 'image/webp';
        default: return 'application/octet-stream';
    }
}

seedImages();
