import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Upload,
    Trash2,
    ExternalLink,
    Loader2,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { uploadDocument, deleteDocument, validateDocumentFile } from "@/lib/storage";

interface ApplicationTableProps {
    applications: any[];
    userId: string;
    onRefresh: () => void;
}

const STATUS_OPTIONS = [
    { value: "interested", label: "Interested" },
    { value: "applying", label: "Applying" },
    { value: "submitted", label: "Submitted" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
];

export default function ApplicationTable({ applications, userId, onRefresh }: ApplicationTableProps) {
    const { toast } = useToast();
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

    const handleStatusChange = async (appId: string, newStatus: string) => {
        const { error } = await supabase
            .from("applications" as any)
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq("id", appId);

        if (error) {
            toast({
                variant: "destructive",
                title: "Update failed",
                description: error.message,
            });
        } else {
            onRefresh();
            toast({ title: "Status updated" });
        }
    };

    const handleUploadClick = (appId: string) => {
        setSelectedAppId(appId);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedAppId) return;

        const validationError = validateDocumentFile(file);
        if (validationError) {
            toast({
                variant: "destructive",
                title: "Invalid file",
                description: validationError,
            });
            return;
        }

        setUploadingId(selectedAppId);

        try {
            const app = applications.find(a => a.id === selectedAppId);

            // If already exists, delete from storage first
            if (app?.submission_proof_url) {
                try {
                    await deleteDocument(app.submission_proof_url);
                } catch (err) {
                    console.error("Old file deletion failed (might not exist):", err);
                }
            }

            // Upload to storage
            const { signedUrl } = await uploadDocument(userId, file, `proof_${selectedAppId}`);

            // Update database
            const { error } = await supabase
                .from("applications" as any)
                .update({ submission_proof_url: signedUrl, updated_at: new Date().toISOString() })
                .eq("id", selectedAppId);

            if (error) throw error;

            toast({
                title: "Success!",
                description: "Application form uploaded successfully.",
            });
            onRefresh();
        } catch (error: any) {
            console.error("Upload failed:", error);
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: error.message,
            });
        } finally {
            setUploadingId(null);
            setSelectedAppId(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteProof = async (appId: string, fileUrl: string) => {
        if (!confirm("Are you sure you want to delete this submission proof?")) return;

        setDeletingId(appId);

        try {
            await deleteDocument(fileUrl);

            const { error } = await supabase
                .from("applications" as any)
                .update({ submission_proof_url: null, updated_at: new Date().toISOString() })
                .eq("id", appId);

            if (error) throw error;

            toast({
                title: "Deleted",
                description: "Submission proof has been removed.",
            });
            onRefresh();
        } catch (error: any) {
            console.error("Delete failed:", error);
            toast({
                variant: "destructive",
                title: "Delete failed",
                description: error.message,
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="mt-8 rounded-xl border bg-card overflow-hidden">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,image/jpeg,image/png"
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">University Name</TableHead>
                        <TableHead>Application Proof</TableHead>
                        <TableHead className="w-[200px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No applications tracked yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        applications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        {app.university?.icon_url ? (
                                            <img
                                                src={app.university.icon_url}
                                                alt={app.university.name}
                                                className="w-8 h-8 rounded-md object-contain"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs">
                                                🏛️
                                            </div>
                                        )}
                                        {app.university?.name || "Unknown University"}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {app.submission_proof_url ? (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(app.submission_proof_url, '_blank')}
                                                    className="h-8 gap-2"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    View Proof
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteProof(app.id, app.submission_proof_url)}
                                                    disabled={deletingId === app.id}
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    {deletingId === app.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleUploadClick(app.id)}
                                                    disabled={uploadingId === app.id}
                                                    className="h-8"
                                                >
                                                    Replace
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleUploadClick(app.id)}
                                                disabled={uploadingId === app.id}
                                                className="h-8 gap-2 border-dashed"
                                            >
                                                {uploadingId === app.id ? (
                                                    <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                                                ) : (
                                                    <><Upload className="h-4 w-4" /> Upload </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={app.status}
                                        onValueChange={(value) => handleStatusChange(app.id, value)}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
