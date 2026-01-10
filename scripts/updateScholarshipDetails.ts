/**
 * Update Scholarship Details Script
 * 
 * This script updates existing scholarships with enhanced descriptions and eligibility criteria.
 * 
 * To run this script:
 * npx tsx scripts/updateScholarshipDetails.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { enhancedScholarships } from '../src/components/admin/data/enhancedScholarshipData.js';

// Load environment variables
config();

// Get Supabase credentials (Vite format)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateScholarshipDetails() {
    console.log('🔄 Starting scholarship details update...');
    console.log(`📝 Updating ${enhancedScholarships.length} scholarships with enhanced descriptions and eligibility...\n`);

    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    for (const scholarship of enhancedScholarships) {
        try {
            // Find scholarship by title
            const { data: existing, error: fetchError } = await supabase
                .from('scholarships')
                .select('id, title')
                .eq('title', scholarship.title)
                .single();

            if (fetchError) {
                console.error(`❌ Error finding "${scholarship.title}":`, fetchError.message);
                failureCount++;
                errors.push(`${scholarship.title}: ${fetchError.message}`);
                continue;
            }

            if (!existing) {
                console.warn(`⚠️  Scholarship not found: "${scholarship.title}"`);
                failureCount++;
                errors.push(`${scholarship.title}: Not found in database`);
                continue;
            }

            // Update scholarship with enhanced data
            const { error: updateError } = await supabase
                .from('scholarships')
                .update({
                    description: scholarship.description,
                    eligibility: scholarship.eligibility
                })
                .eq('id', existing.id);

            if (updateError) {
                console.error(`❌ Error updating "${scholarship.title}":`, updateError.message);
                failureCount++;
                errors.push(`${scholarship.title}: ${updateError.message}`);
            } else {
                console.log(`✅ Updated: ${scholarship.title}`);
                successCount++;
            }
        } catch (err: any) {
            console.error(`❌ Unexpected error for "${scholarship.title}":`, err.message);
            failureCount++;
            errors.push(`${scholarship.title}: ${err.message}`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Update Summary:');
    console.log(`  ✅ Successfully updated: ${successCount} scholarships`);
    console.log(`  ❌ Failed to update: ${failureCount} scholarships`);
    console.log('='.repeat(60));

    if (errors.length > 0) {
        console.log('\n⚠️  Errors encountered:');
        errors.forEach(error => console.log(`  • ${error}`));
    }

    console.log('\n✨ Update process completed!\n');
    process.exit(errors.length > 0 ? 1 : 0);
}

updateScholarshipDetails();
