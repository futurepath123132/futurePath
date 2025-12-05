import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Scholarship {
    id: string;
    title: string;
    provider: string;
    amount: string;
    eligibility: string;
    deadline: string;
    program_level: string;
    link: string;
    description: string;
    disciplines: string[];
    documents_required: string[];
    image_url?: string;
}

interface ScholarshipDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: Scholarship | null;
    onSuccess: () => void;
    trigger?: React.ReactNode;
}

export function ScholarshipDialog({ open, onOpenChange, initialData, onSuccess, trigger }: ScholarshipDialogProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        provider: '',
        amount: '',
        eligibility: '',
        deadline: '',
        program_level: '',
        link: '',
        description: '',
        disciplines: '',
        documents_required: '',
        image: null as File | null,
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    provider: initialData.provider,
                    amount: initialData.amount || '',
                    eligibility: initialData.eligibility || '',
                    deadline: initialData.deadline || '',
                    program_level: initialData.program_level || '',
                    link: initialData.link || '',
                    description: initialData.description || '',
                    disciplines: initialData.disciplines?.join(', ') || '',
                    documents_required: initialData.documents_required?.join(', ') || '',
                    image: null,
                });
            } else {
                resetForm();
            }
        }
    }, [initialData, open]);

    const resetForm = () => {
        setFormData({
            title: '',
            provider: '',
            amount: '',
            eligibility: '',
            deadline: '',
            program_level: '',
            link: '',
            description: '',
            disciplines: '',
            documents_required: '',
            image: null,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let imageUrl: string | null = null;

        if (formData.image) {
            const file = formData.image;
            const filePath = `scholarships/${initialData?.id || crypto.randomUUID()}/${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from('scholarships-images')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                toast({ variant: 'destructive', title: 'Error', description: uploadError.message });
                return;
            }

            const { data: urlData } = supabase.storage
                .from('scholarships-images')
                .getPublicUrl(filePath);

            imageUrl = urlData.publicUrl;
        }

        const scholarshipData: any = {
            title: formData.title,
            provider: formData.provider,
            amount: formData.amount || null,
            eligibility: formData.eligibility || null,
            deadline: formData.deadline || null,
            program_level: formData.program_level || null,
            link: formData.link || null,
            description: formData.description || null,
            disciplines: formData.disciplines ? formData.disciplines.split(',').map(d => d.trim()) : [],
            documents_required: formData.documents_required ? formData.documents_required.split(',').map(d => d.trim()) : [],
            created_by: user?.id,
            ...(imageUrl && { image_url: imageUrl }),
        };

        if (initialData?.id) {
            const { error } = await supabase
                .from('scholarships')
                .update(scholarshipData)
                .eq('id', initialData.id);

            if (error) {
                toast({ variant: 'destructive', title: 'Error', description: error.message });
            } else {
                toast({ title: 'Success', description: 'Scholarship updated successfully' });
                onOpenChange(false);
                resetForm();
                onSuccess();
            }
        } else {
            const { error } = await supabase
                .from('scholarships')
                .insert(scholarshipData);

            if (error) {
                toast({ variant: 'destructive', title: 'Error', description: error.message });
            } else {
                toast({ title: 'Success', description: 'Scholarship added successfully' });
                onOpenChange(false);
                resetForm();
                onSuccess();
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) resetForm();
        }}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Scholarship' : 'Add New Scholarship'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Scholarship Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="provider">Provider *</Label>
                            <Input
                                id="provider"
                                value={formData.provider}
                                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                placeholder="e.g., 50,000 PKR"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="image">Scholarship Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })
                            }
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="program_level">Program Level</Label>
                            <Select
                                value={formData.program_level}
                                onValueChange={(value) => setFormData({ ...formData, program_level: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BS">BS</SelectItem>
                                    <SelectItem value="MS">MS</SelectItem>
                                    <SelectItem value="PhD">PhD</SelectItem>
                                    <SelectItem value="Diploma">Diploma</SelectItem>
                                    <SelectItem value="Certificate">Certificate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="eligibility">Eligibility</Label>
                        <Textarea
                            id="eligibility"
                            value={formData.eligibility}
                            onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="link">Application Link</Label>
                        <Input
                            id="link"
                            type="url"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="disciplines">Disciplines (comma-separated)</Label>
                        <Input
                            id="disciplines"
                            placeholder="e.g., Computer Science, Engineering"
                            value={formData.disciplines}
                            onChange={(e) => setFormData({ ...formData, disciplines: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="documents_required">Documents Required (comma-separated)</Label>
                        <Input
                            id="documents_required"
                            placeholder="e.g., Transcript, CNIC, Recommendation Letter"
                            value={formData.documents_required}
                            onChange={(e) => setFormData({ ...formData, documents_required: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit">
                            {initialData ? 'Update Scholarship' : 'Add Scholarship'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
