import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    FileText,
    Upload,
    Trash2,
    Download,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import {
    uploadDocument,
    deleteDocument,
    validateDocumentFile
} from '@/lib/storage';
import { Progress } from "@/components/ui/progress";

interface UserDocument {
    id: string;
    document_type: string;
    file_name: string;
    file_url: string;
    file_size: number;
    file_type: string;
    created_at: string;
}

interface UserDocumentsProps {
    userId: string;
}

const DOCUMENT_TYPES = [
    "Matric Marksheet",
    "Intermediate Marksheet",
    "CNIC",
    "Domicile",
    "Other Admission Document"
];

export default function UserDocuments({ userId }: UserDocumentsProps) {
    const { toast } = useToast();
    const [documents, setDocuments] = useState<Record<string, UserDocument>>({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const fetchDocuments = async () => {
        try {
            const { data, error } = await supabase
                .from('user_documents')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;

            const docsMap: Record<string, UserDocument> = {};
            data?.forEach(doc => {
                docsMap[doc.document_type] = doc;
            });
            setDocuments(docsMap);
        } catch (error: any) {
            console.error('Error fetching documents:', error);
            toast({
                variant: 'destructive',
                title: 'Error loading documents',
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [userId]);

    const handleUploadClick = (type: string) => {
        setSelectedType(type);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedType) return;

        const validationError = validateDocumentFile(file);
        if (validationError) {
            toast({
                variant: 'destructive',
                title: 'Invalid file',
                description: validationError,
            });
            return;
        }

        setUploading(selectedType);

        try {
            // If already exists, delete from storage first
            if (documents[selectedType]) {
                await deleteDocument(documents[selectedType].file_url);
            }

            // Upload to storage
            const { signedUrl, filePath } = await uploadDocument(userId, file, selectedType);

            // Save to database
            const docData = {
                user_id: userId,
                document_type: selectedType,
                file_name: file.name,
                file_url: signedUrl, // We store the signed URL for convenience, or we could store the path
                file_size: file.size,
                file_type: file.type,
            };

            const { data, error } = await supabase
                .from('user_documents')
                .upsert(docData, { onConflict: 'user_id,document_type' })
                .select()
                .single();

            if (error) throw error;

            setDocuments(prev => ({
                ...prev,
                [selectedType]: data
            }));

            toast({
                title: 'Success!',
                description: `${selectedType} uploaded successfully.`,
            });
        } catch (error: any) {
            console.error('Upload failed:', error);
            toast({
                variant: 'destructive',
                title: 'Upload failed',
                description: error.message,
            });
        } finally {
            setUploading(null);
            setSelectedType(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (type: string) => {
        const doc = documents[type];
        if (!doc) return;

        if (!confirm(`Are you sure you want to delete your ${type}?`)) return;

        setDeleting(type);

        try {
            // Delete from storage
            await deleteDocument(doc.file_url);

            // Delete from database
            const { error } = await supabase
                .from('user_documents')
                .delete()
                .eq('id', doc.id);

            if (error) throw error;

            setDocuments(prev => {
                const newDocs = { ...prev };
                delete newDocs[type];
                return newDocs;
            });

            toast({
                title: 'Deleted',
                description: `${type} has been removed.`,
            });
        } catch (error: any) {
            console.error('Delete failed:', error);
            toast({
                variant: 'destructive',
                title: 'Delete failed',
                description: error.message,
            });
        } finally {
            setDeleting(null);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="shadow-lg border-primary/10">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    My Documents
                </CardTitle>
                <CardDescription>
                    Upload and manage your academic and identification documents safely.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,image/jpeg,image/png"
                />

                <div className="space-y-4">
                    {DOCUMENT_TYPES.map((type) => {
                        const doc = documents[type];
                        const isUploading = uploading === type;
                        const isDeleting = deleting === type;

                        return (
                            <div
                                key={type}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${doc ? 'bg-green-100 text-green-600' : 'bg-primary/5 text-primary'}`}>
                                        {doc ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{type}</h4>
                                        {doc ? (
                                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                {doc.file_name} • {formatFileSize(doc.file_size)}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">Not uploaded yet</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {doc ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 md:flex-none"
                                                onClick={() => window.open(doc.file_url, '_blank')}
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 md:flex-none"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = doc.file_url;
                                                    link.download = doc.file_name;
                                                    link.click();
                                                }}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(type)}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleUploadClick(type)}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Replace"}
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="w-full md:w-auto bg-primary hover:bg-primary/90"
                                            onClick={() => handleUploadClick(type)}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? (
                                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                                            ) : (
                                                <><Upload className="h-4 w-4 mr-2" /> Upload</>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">Security & Privacy</p>
                        Your documents are stored securely and are only accessible by you. Supported formats: **PDF, JPG, PNG**. Max file size: **5MB**.
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
