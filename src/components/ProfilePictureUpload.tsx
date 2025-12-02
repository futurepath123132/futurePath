import React, { useRef, useState } from 'react';
import { Camera, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
    uploadProfilePicture,
    deleteProfilePicture,
    validateImageFile,
    getInitials,
} from '@/lib/storage';

interface ProfilePictureUploadProps {
    userId: string;
    currentImageUrl: string | null;
    userName: string;
    onImageUpdate: (newUrl: string | null) => void;
}

export default function ProfilePictureUpload({
    userId,
    currentImageUrl,
    userName,
    onImageUpdate,
}: ProfilePictureUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file
        const validationError = validateImageFile(file);
        if (validationError) {
            toast({
                variant: 'destructive',
                title: 'Invalid file',
                description: validationError,
            });
            return;
        }

        setUploading(true);

        try {
            // Delete old image if exists
            if (currentImageUrl) {
                try {
                    await deleteProfilePicture(currentImageUrl);
                } catch (error) {
                    console.error('Error deleting old image:', error);
                }
            }

            // Upload new image
            const publicUrl = await uploadProfilePicture(userId, file);

            // Update database
            const { error } = await supabase
                .from('profiles')
                .update({ profilepic: publicUrl })
                .eq('id', userId);

            if (error) throw error;

            onImageUpdate(publicUrl);
            toast({
                title: 'Success!',
                description: 'Profile picture updated.',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Upload failed',
                description: error.message || 'Failed to upload image.',
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async () => {
        if (!currentImageUrl) return;

        setDeleting(true);

        try {
            // Delete from storage
            await deleteProfilePicture(currentImageUrl);

            // Update database
            const { error } = await supabase
                .from('profiles')
                .update({ profilepic: null })
                .eq('id', userId);

            if (error) throw error;

            onImageUpdate(null);
            toast({
                title: 'Success!',
                description: 'Profile picture removed.',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Delete failed',
                description: error.message || 'Failed to delete image.',
            });
        } finally {
            setDeleting(false);
        }
    };

    const initials = getInitials(userName);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border bg-muted flex items-center justify-center">
                    {currentImageUrl ? (
                        <img
                            src={currentImageUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <span className="text-4xl font-bold text-primary">{initials}</span>
                        </div>
                    )}
                </div>

                {/* Upload button overlay */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                >
                    <Camera className="h-8 w-8 text-white" />
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
            />

            <div className="flex gap-2">
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || deleting}
                    variant="outline"
                    size="sm"
                >
                    {uploading ? 'Uploading...' : currentImageUrl ? 'Change Photo' : 'Upload Photo'}
                </Button>

                {currentImageUrl && (
                    <Button
                        onClick={handleDelete}
                        disabled={uploading || deleting}
                        variant="outline"
                        size="sm"
                    >
                        {deleting ? 'Removing...' : <Trash2 className="h-4 w-4" />}
                    </Button>
                )}
            </div>
        </div>
    );
}
