
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ScraperReviewProps {
    scrapedData: any;
    setScrapedData: (data: any) => void;
    type: 'scholarship' | 'university';
    uploadedImages: File[];
    setUploadedImages: (files: File[]) => void;
    handleSave: () => void;
}

export default function ScraperReview({
    scrapedData,
    setScrapedData,
    type,
    uploadedImages,
    setUploadedImages,
    handleSave
}: ScraperReviewProps) {
    if (!scrapedData) return null;

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle>Review & Save</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {type === 'scholarship' ? (
                        <>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Title</Label>
                                    <Input value={scrapedData.title} onChange={(e) => setScrapedData({ ...scrapedData, title: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Provider</Label>
                                    <Input value={scrapedData.provider} onChange={(e) => setScrapedData({ ...scrapedData, provider: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Amount</Label>
                                    <Input value={scrapedData.amount} onChange={(e) => setScrapedData({ ...scrapedData, amount: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Deadline</Label>
                                    <Input type="date" value={scrapedData.deadline} onChange={(e) => setScrapedData({ ...scrapedData, deadline: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea value={scrapedData.description} onChange={(e) => setScrapedData({ ...scrapedData, description: e.target.value })} rows={3} />
                            </div>
                            <div>
                                <Label>Eligibility</Label>
                                <Textarea value={scrapedData.eligibility} onChange={(e) => setScrapedData({ ...scrapedData, eligibility: e.target.value })} rows={3} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Program Level</Label>
                                    <Select
                                        value={scrapedData.program_level}
                                        onValueChange={(value) => setScrapedData({ ...scrapedData, program_level: value })}
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
                                            <SelectItem value="Other">All</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Link</Label>
                                    <Input value={scrapedData.link} onChange={(e) => setScrapedData({ ...scrapedData, link: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <Label>Disciplines (comma-separated)</Label>
                                <Input value={scrapedData.disciplines} onChange={(e) => setScrapedData({ ...scrapedData, disciplines: e.target.value })} />
                            </div>
                            <div>
                                <Label>Documents Required (comma-separated)</Label>
                                <Input value={scrapedData.documents_required} onChange={(e) => setScrapedData({ ...scrapedData, documents_required: e.target.value })} />
                            </div>
                            <div>
                                <Label>Image URL</Label>
                                <Input value={scrapedData.image_url} onChange={(e) => setScrapedData({ ...scrapedData, image_url: e.target.value })} placeholder="https://example.com/image.jpg" />
                                {scrapedData.image_url && <img src={scrapedData.image_url} alt="Preview" className="mt-2 h-32 object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><Label>Name</Label><Input value={scrapedData.name} onChange={(e) => setScrapedData({ ...scrapedData, name: e.target.value })} /></div>
                                <div><Label>City</Label><Input value={scrapedData.city} onChange={(e) => setScrapedData({ ...scrapedData, city: e.target.value })} /></div>
                            </div>
                            <div><Label>Address</Label><Input value={scrapedData.address} onChange={(e) => setScrapedData({ ...scrapedData, address: e.target.value })} /></div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><Label>Website</Label><Input value={scrapedData.website} onChange={(e) => setScrapedData({ ...scrapedData, website: e.target.value })} /></div>
                                <div><Label>Apply Link</Label><Input value={scrapedData.apply_link} onChange={(e) => setScrapedData({ ...scrapedData, apply_link: e.target.value })} /></div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><Label>Contact Email</Label><Input value={scrapedData.contact_email} onChange={(e) => setScrapedData({ ...scrapedData, contact_email: e.target.value })} /></div>
                                <div><Label>Contact Phone</Label><Input value={scrapedData.contact_phone} onChange={(e) => setScrapedData({ ...scrapedData, contact_phone: e.target.value })} /></div>
                            </div>
                            <div><Label>Description</Label><Textarea value={scrapedData.description} onChange={(e) => setScrapedData({ ...scrapedData, description: e.target.value })} rows={3} /></div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Disciplines (comma-separated)</Label>
                                    <Input value={scrapedData.disciplines} onChange={(e) => setScrapedData({ ...scrapedData, disciplines: e.target.value })} placeholder="e.g. CS, Engineering, Arts" />
                                </div>
                                <div>
                                    <Label>Size (sq ft / acres)</Label>
                                    <Input value={scrapedData.size} onChange={(e) => setScrapedData({ ...scrapedData, size: e.target.value })} placeholder="e.g. 100 acres" />
                                </div>
                            </div>

                            <div>
                                <Label>Icon URL</Label>
                                <Input value={scrapedData.icon_url} onChange={(e) => setScrapedData({ ...scrapedData, icon_url: e.target.value })} placeholder="https://example.com/logo.png" />
                                {scrapedData.icon_url && <img src={scrapedData.icon_url} alt="Preview" className="mt-2 h-16 w-16 object-contain rounded border" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label>University Images</Label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.onchange = (e) => {
                                                const file = (e.target as HTMLInputElement).files?.[0];
                                                if (file) {
                                                    setUploadedImages([...uploadedImages, file]);
                                                }
                                            };
                                            input.click();
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Add Image
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {/* Show URL-based images from crawler */}
                                    {(scrapedData.university_images || []).filter((img: string) => img.trim() !== '').map((img: string, index: number) => (
                                        <div key={`url-${index}`} className="border rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <Label className="text-sm text-muted-foreground">From Crawler (URL)</Label>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        const newImages = scrapedData.university_images?.filter((_: string, i: number) => i !== index) || [];
                                                        setScrapedData({ ...scrapedData, university_images: newImages });
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                            <Input
                                                value={img}
                                                onChange={(e) => {
                                                    const newImages = [...(scrapedData.university_images || [])];
                                                    newImages[index] = e.target.value;
                                                    setScrapedData({ ...scrapedData, university_images: newImages });
                                                }}
                                                placeholder="Image URL"
                                                className="mb-2"
                                            />
                                            {img && (
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index + 1}`}
                                                    className="mt-2 h-[200px] w-[200px] object-cover rounded"
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
                                            )}
                                        </div>
                                    ))}

                                    {/* Show uploaded file images */}
                                    {uploadedImages.map((file, index) => (
                                        <div key={`file-${index}`} className="border rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <Label className="text-sm text-muted-foreground">Uploaded File: {file.name}</Label>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Upload preview ${index + 1}`}
                                                className="mt-2 h-[200px] w-[200px] object-cover rounded"
                                            />
                                        </div>
                                    ))}

                                    {(scrapedData.university_images?.filter((img: string) => img.trim() !== '').length === 0 && uploadedImages.length === 0) && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No images added yet. Click "Add Image" to upload from your computer.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <Button className="w-full mt-4" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Save to Database
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
