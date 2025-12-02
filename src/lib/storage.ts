import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads a profile picture to Supabase storage
 * @param userId - The user's ID
 * @param file - The image file to upload
 * @returns The signed URL of the uploaded image
 */
export async function uploadProfilePicture(
    userId: string,
    file: File
): Promise<string> {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Upload the file to the profilePic bucket
    const { error: uploadError } = await supabase.storage
        .from('profilePic')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (uploadError) {
        throw uploadError;
    }

    // Get a signed URL (works for private buckets with auth)
    // Valid for 1 year (31536000 seconds)
    const { data, error: urlError } = await supabase.storage
        .from('profilePic')
        .createSignedUrl(filePath, 31536000);

    if (urlError || !data) {
        throw urlError || new Error('Failed to create signed URL');
    }

    return data.signedUrl;
}

/**
 * Deletes a profile picture from Supabase storage
 * @param profilePicUrl - The full URL of the profile picture
 */
export async function deleteProfilePicture(
    profilePicUrl: string
): Promise<void> {
    // Extract the file path from the URL
    // Handle both signed URLs and public URLs
    let filePath: string;

    if (profilePicUrl.includes('/object/sign/profilePic/')) {
        // Signed URL format
        const parts = profilePicUrl.split('/object/sign/profilePic/');
        filePath = parts[1]?.split('?')[0] || '';
    } else if (profilePicUrl.includes('/profilePic/')) {
        // Public URL format
        const parts = profilePicUrl.split('/profilePic/');
        filePath = parts[1] || '';
    } else {
        throw new Error('Invalid profile picture URL');
    }

    if (!filePath) {
        throw new Error('Could not extract file path from URL');
    }

    const { error } = await supabase.storage
        .from('profilePic')
        .remove([filePath]);

    if (error) {
        throw error;
    }
}

/**
 * Validates image file before upload
 * @param file - The file to validate
 * @returns Error message if invalid, null if valid
 */
export function validateImageFile(file: File): string | null {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
        return 'Please upload a JPG, PNG, or WebP image.';
    }

    if (file.size > maxSize) {
        return 'Image size must be less than 2MB.';
    }

    return null;
}

/**
 * Generates initials from a full name
 * @param name - The full name
 * @returns The initials (max 2 characters)
 */
export function getInitials(name: string): string {
    if (!name) return '?';

    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
