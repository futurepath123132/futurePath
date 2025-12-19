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
 * Uploads a document to Supabase storage
 * @param userId - The user's ID
 * @param file - The document file to upload
 * @param documentType - The type of document (e.g., "CNIC", "Matric Marksheet")
 * @returns The signed URL of the uploaded document and the file path
 */
export async function uploadDocument(
    userId: string,
    file: File,
    documentType: string
): Promise<{ signedUrl: string; filePath: string }> {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const cleanType = documentType.replace(/\s+/g, '_').toLowerCase();
    const fileName = `${userId}/${cleanType}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Upload the file to the user-documents bucket
    const { error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (uploadError) {
        throw uploadError;
    }

    // Get a signed URL
    // Valid for 1 year
    const { data, error: urlError } = await supabase.storage
        .from('user-documents')
        .createSignedUrl(filePath, 31536000);

    if (urlError || !data) {
        throw urlError || new Error('Failed to create signed URL');
    }

    return { signedUrl: data.signedUrl, filePath };
}

/**
 * Deletes a document from Supabase storage
 * @param fileUrl - The signed URL or path of the document
 */
export async function deleteDocument(
    fileUrl: string
): Promise<void> {
    let filePath: string;

    if (fileUrl.includes('/object/sign/user-documents/')) {
        // Signed URL format
        const parts = fileUrl.split('/object/sign/user-documents/');
        filePath = parts[1]?.split('?')[0] || '';
    } else if (fileUrl.includes('/user-documents/')) {
        // Public/Path format
        const parts = fileUrl.split('/user-documents/');
        filePath = parts[1] || '';
    } else {
        // Assume it's just the path
        filePath = fileUrl;
    }

    if (!filePath) {
        throw new Error('Could not extract file path from URL');
    }

    const { error } = await supabase.storage
        .from('user-documents')
        .remove([filePath]);

    if (error) {
        throw error;
    }
}

/**
 * Validates document file before upload
 * @param file - The file to validate
 * @returns Error message if invalid, null if valid
 */
export function validateDocumentFile(file: File): string | null {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
    ];

    if (!allowedTypes.includes(file.type)) {
        return 'Please upload a PDF, JPG, or PNG file.';
    }

    if (file.size > maxSize) {
        return 'File size must be less than 5MB.';
    }

    return null;
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
