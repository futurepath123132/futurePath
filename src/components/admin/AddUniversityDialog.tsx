import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/ui/loader';
import { Program } from '@/components/university-detail/types';

export interface University {
    id: string;
    name: string;
    city: string;
    address: string;
    website: string;
    tuition_range: string;
    ranking: number;
    description: string;
    apply_link: string;
    contact_email: string;
    contact_phone: string;
    disciplines: string[];
    programs: Program[];
    application_deadline?: string;
    images?: string[];
    icon_url?: string;
    hec_recognized?: boolean;
    scimago_ranking?: string;
    qs_ranking?: string;
    study_mode?: 'On-site' | 'Online' | 'Hybrid';
    size?: string;
    // credit_hours removed from UI but kept in type optional if needed, or removed. Keeping optional for backward compat if DB has it.
    credit_hours?: number;
    starting_date?: string;
    admission_requirements?: string;
}

interface AddUniversityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    universityToEdit?: University | null;
    onSuccess: () => void;
}

export function AddUniversityDialog({ open, onOpenChange, universityToEdit, onSuccess }: AddUniversityDialogProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<FileList | null>(null);
    const [icon, setIcon] = useState<File | null>(null);

    const [programs, setPrograms] = useState<Program[]>([]);
    const [currentProgram, setCurrentProgram] = useState({ name: '', url: '' });

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        website: '',
        tuition_range: '',
        ranking: '',
        description: '',
        apply_link: '',
        contact_email: '',
        contact_phone: '',
        disciplines: '',
        application_deadline: '',
        study_mode: 'On-site' as 'On-site' | 'Online' | 'Hybrid',
        size: '',
        starting_date: '',
        hec_recognized: false,
        scimago_ranking: '',
        qs_ranking: '',
        admission_requirements: '',
    });

    useEffect(() => {
        if (universityToEdit) {
            setPrograms(universityToEdit.programs || []);
            setFormData({
                name: universityToEdit.name || '',
                city: universityToEdit.city || '',
                address: universityToEdit.address || '',
                website: universityToEdit.website || '',
                tuition_range: universityToEdit.tuition_range || '',
                ranking: universityToEdit.ranking?.toString() || '',
                description: universityToEdit.description || '',
                apply_link: universityToEdit.apply_link || '',
                contact_email: universityToEdit.contact_email || '',
                contact_phone: universityToEdit.contact_phone || '',
                disciplines: universityToEdit.disciplines?.join(', ') || '',
                application_deadline: universityToEdit.application_deadline || '',
                study_mode: universityToEdit.study_mode || 'On-site',
                size: universityToEdit.size || '',
                starting_date: universityToEdit.starting_date || '',
                hec_recognized: universityToEdit.hec_recognized || false,
                scimago_ranking: universityToEdit.scimago_ranking || '',
                qs_ranking: universityToEdit.qs_ranking || '',
                admission_requirements: universityToEdit.admission_requirements || '',
            });
        } else {
            resetForm();
        }
    }, [universityToEdit, open]);

    const resetForm = () => {
        setFormData({
            name: '', city: '', address: '', website: '', tuition_range: '', ranking: '',
            description: '', apply_link: '', contact_email: '', contact_phone: '',
            disciplines: '', application_deadline: '', study_mode: 'On-site',
            size: '', starting_date: '', admission_requirements: '',
            hec_recognized: false, scimago_ranking: '', qs_ranking: '',
        });
        setPrograms([]);
        setCurrentProgram({ name: '', url: '' });
        setImages(null);
        setIcon(null);
    };

    const addProgram = () => {
        if (currentProgram.name && currentProgram.url) {
            setPrograms([...programs, { name: currentProgram.name, url: currentProgram.url }]);
            setCurrentProgram({ name: '', url: '' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide both program name and URL' });
        }
    };

    const removeProgram = (index: number) => {
        setPrograms(programs.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let imageUrls: string[] = universityToEdit?.images || [];
        let iconUrl: string | null = universityToEdit?.icon_url || null;

        try {
            if (icon) {
                //sanitize name for folder
                const safeName = formData.name.replace(/[^a-zA-Z0-9-_]/g, "_");
                const iconPath = `${safeName}/icon_${Date.now()}_${icon.name}`;
                const { error: iconUploadError } = await supabase.storage.from('uni_icon').upload(iconPath, icon, { upsert: true });
                if (iconUploadError) throw new Error(iconUploadError.message);

                const { data: iconPublicUrl } = supabase.storage.from('uni_icon').getPublicUrl(iconPath);
                iconUrl = iconPublicUrl.publicUrl;
            }

            if (images && images.length > 0) {
                const newImageUrls: string[] = [];
                for (const file of Array.from(images)) {
                    const filePath = `${formData.name}/${Date.now()}_${file.name}`;
                    const { error: uploadError } = await supabase.storage.from('university-images').upload(filePath, file);
                    if (uploadError) throw new Error(uploadError.message);

                    const { data: publicUrlData } = supabase.storage.from('university-images').getPublicUrl(filePath);
                    newImageUrls.push(publicUrlData.publicUrl);
                }
                // If editing, we append new images effectively via logic, but here we just reset if we want to add more 
                // or we could replace. The original logic was pushing to empty, effectively replacing or appending if complex logic used.
                // The original code: `let imageUrls: string[] = [];` meant it REPLACED all images if new ones were uploaded? 
                // Or did it just handle new uploads?
                // Original code: `if (images && images.length > 0) { ... imageUrls.push(...) }` then `images: imageUrls.length ? imageUrls : undefined`. 
                // This implies if you upload new images, you LOSE the old ones if you don't handle it carefully, OR 
                // if `undefined`, it might not update the column if using `.update()`. 
                // However, looking at the original code: 
                // `images: imageUrls.length ? imageUrls : undefined` passed to update.
                // If I upload 1 new image, imageUrls has 1 image. The DB update will set images = [1 image]. 
                // So previous images are lost. I will maintain this behavior for now to match original logic, 
                // unless I want to improve it. But strict refactor means keep logic.
                // Wait, if `images` is undefined, supabase update might skip it? No, if passing `undefined` in JS object to supabase `update`, 
                // it indeed usually ignores it (or sets null?). 
                // Actually, let's look at `const universityData = { ... images: imageUrls.length ? imageUrls : undefined }`. 
                // If I don't upload images, `imageUrls` is empty. `images` becomes `undefined`. 
                // Supabase-js `update` ignores undefined keys? Yes. So old images stay.
                // If I upload images, `imageUrls` has items. Old images are replaced. 
                // I will replicate this logic.

                imageUrls = newImageUrls;
            }

            const universityData = {
                ...formData,
                ranking: formData.ranking ? parseInt(formData.ranking) : null,
                disciplines: formData.disciplines ? formData.disciplines.split(',').map(d => d.trim()) : [],
                programs: programs,
                created_by: user?.id,
                // Only include images/icon_url if they were updated (or if we want to overwrite)
                // If imageUrls has items, it means we uploaded new ones, so we overwrite.
                // If imageUrls is empty, we pass undefined to NOT update the column (keep existing).
                images: images && images.length > 0 ? imageUrls : undefined,
                icon_url: icon ? iconUrl : undefined,
                // credit_hours: formData.credit_hours ? parseInt(formData.credit_hours) : null, // Removed from UI
                starting_date: formData.starting_date || null,
                admission_requirements: formData.admission_requirements || null,
            };

            if (universityToEdit) {
                const { error } = await supabase.from('universities').update(universityData as any).eq('id', universityToEdit.id);
                if (error) throw error;
                toast({ title: 'Success', description: 'University updated successfully' });
            } else {
                const { error } = await supabase.from('universities').insert(universityData as any);
                if (error) throw error;
                toast({ title: 'Success', description: 'University added successfully' });
            }

            onSuccess();
            onOpenChange(false);
            resetForm();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{universityToEdit ? 'Edit University' : 'Add New University'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label htmlFor="name">University Name *</Label><Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                        <div><Label htmlFor="city">City *</Label><Input id="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required /></div>
                    </div>
                    <div><Label htmlFor="address">Address</Label><Input id="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} /></div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label htmlFor="website">Website URL</Label><Input id="website" type="url" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} /></div>
                        <div><Label htmlFor="apply_link">Apply Link</Label><Input id="apply_link" type="url" value={formData.apply_link} onChange={e => setFormData({ ...formData, apply_link: e.target.value })} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label htmlFor="tuition_range">Tuition Range</Label><Input id="tuition_range" placeholder="e.g., 100,000 - 300,000 PKR" value={formData.tuition_range} onChange={e => setFormData({ ...formData, tuition_range: e.target.value })} /></div>
                        <div><Label htmlFor="ranking">Ranking</Label><Input id="ranking" type="number" value={formData.ranking} onChange={e => setFormData({ ...formData, ranking: e.target.value })} /></div>
                    </div>
                    <div><Label htmlFor="size">Size (sq ft)</Label><Input id="size" placeholder="e.g., 500,000" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} /></div>
                    <div className="grid md:grid-cols-2 gap-4">
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label htmlFor="hec_recognized">HEC Recognized</Label>
                            <Select
                                value={formData.hec_recognized ? "Yes" : "No"}
                                onValueChange={(value) => setFormData({ ...formData, hec_recognized: value === "Yes" })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label htmlFor="ranking">HEC Ranking</Label><Input id="ranking" type="number" value={formData.ranking} onChange={e => setFormData({ ...formData, ranking: e.target.value })} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label htmlFor="scimago_ranking">Scimago Ranking</Label><Input id="scimago_ranking" value={formData.scimago_ranking} onChange={e => setFormData({ ...formData, scimago_ranking: e.target.value })} /></div>
                        <div><Label htmlFor="qs_ranking">QS Ranking</Label><Input id="qs_ranking" value={formData.qs_ranking} onChange={e => setFormData({ ...formData, qs_ranking: e.target.value })} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label htmlFor="application_deadline">Application Deadline</Label><Input id="application_deadline" type="date" value={formData.application_deadline} onChange={e => setFormData({ ...formData, application_deadline: e.target.value })} /></div>
                        <div><Label htmlFor="starting_date">Starting Date</Label><Input id="starting_date" type="date" value={formData.starting_date} onChange={e => setFormData({ ...formData, starting_date: e.target.value })} /></div>
                    </div>

                    <div>
                        <Label htmlFor="study_mode">Study Mode</Label>
                        <Select
                            value={formData.study_mode}
                            onValueChange={(value) => setFormData({ ...formData, study_mode: value as 'On-site' | 'Online' | 'Hybrid' })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select study mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="On-site">On-site</SelectItem>
                                <SelectItem value="Online">Online</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
                    <div><Label htmlFor="admission_requirements">Admission Requirements</Label><Textarea id="admission_requirements" value={formData.admission_requirements} onChange={e => setFormData({ ...formData, admission_requirements: e.target.value })} rows={3} /></div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label htmlFor="contact_email">Contact Email</Label><Input id="contact_email" type="email" value={formData.contact_email} onChange={e => setFormData({ ...formData, contact_email: e.target.value })} /></div>
                        <div><Label htmlFor="contact_phone">Contact Phone</Label><Input id="contact_phone" value={formData.contact_phone} onChange={e => setFormData({ ...formData, contact_phone: e.target.value })} /></div>
                    </div>
                    <div><Label htmlFor="disciplines">Disciplines (comma-separated)</Label><Input id="disciplines" placeholder="e.g., Computer Science, Engineering, Medicine" value={formData.disciplines} onChange={e => setFormData({ ...formData, disciplines: e.target.value })} /></div>

                    {/* Programs Section */}
                    <div className="space-y-3">
                        <Label>Programs</Label>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    placeholder="Program name (e.g., BS Computer Science)"
                                    value={currentProgram.name}
                                    onChange={e => setCurrentProgram({ ...currentProgram, name: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    type="url"
                                    placeholder="Program URL"
                                    value={currentProgram.url}
                                    onChange={e => setCurrentProgram({ ...currentProgram, url: e.target.value })}
                                />
                                <Button type="button" onClick={addProgram} variant="outline">Add</Button>
                            </div>
                        </div>
                        {programs.length > 0 && (
                            <div className="space-y-2 mt-3">
                                <p className="text-sm text-muted-foreground">Added Programs:</p>
                                {programs.map((program, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{program.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{program.url}</p>
                                        </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => removeProgram(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div><Label htmlFor="icon">Upload Icon</Label><Input id="icon" type="file" accept="image/*" onChange={e => setIcon(e.target.files?.[0] || null)} /></div>
                    <div><Label htmlFor="images">Upload Images</Label><Input id="images" type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} /></div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader className="mr-2 h-4 w-4" />}
                            {loading ? 'Saving...' : (universityToEdit ? 'Update University' : 'Add University')}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
