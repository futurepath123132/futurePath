
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2 } from 'lucide-react';

export interface BulkResult {
    url: string;
    status: 'success' | 'error';
    data?: any;
    error?: string;
    images?: File[];
}

interface BulkScraperResultsProps {
    bulkResults: BulkResult[];
    setBulkResults: (results: BulkResult[]) => void;
    handleBulkSave: () => void;
}

export default function BulkScraperResults({
    bulkResults,
    setBulkResults,
    handleBulkSave
}: BulkScraperResultsProps) {
    if (bulkResults.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Bulk Crawl Results</h2>
                <Button onClick={handleBulkSave} disabled={bulkResults.filter(r => r.status === 'success').length === 0}>
                    <Save className="mr-2 h-4 w-4" />
                    Save All Successful ({bulkResults.filter(r => r.status == 'success').length})
                </Button>
            </div>

            {bulkResults.map((result, index) => (
                <Card key={index} className={result.status === 'error' ? 'border-destructive' : 'border-green-500'}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <CardTitle className="text-lg">{result.status === 'success' ? result.data.name : 'Failed'}</CardTitle>
                                    <span className={`text-xs px-2 py-1 rounded-full ${result.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {result.status === 'success' ? 'Success' : 'Error'}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{result.url}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {result.status === 'error' ? (
                            <div className="p-4 bg-destructive/10 border border-destructive rounded">
                                <p className="text-sm text-destructive font-medium">Error: {result.error}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            value={result.data.name}
                                            onChange={(e) => {
                                                const newResults = [...bulkResults];
                                                newResults[index].data.name = e.target.value;
                                                setBulkResults(newResults);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>City</Label>
                                        <Input
                                            value={result.data.city}
                                            onChange={(e) => {
                                                const newResults = [...bulkResults];
                                                newResults[index].data.city = e.target.value;
                                                setBulkResults(newResults);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Address</Label>
                                    <Input
                                        value={result.data.address}
                                        onChange={(e) => {
                                            const newResults = [...bulkResults];
                                            newResults[index].data.address = e.target.value;
                                            setBulkResults(newResults);
                                        }}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Website</Label>
                                        <Input
                                            value={result.data.website}
                                            onChange={(e) => {
                                                const newResults = [...bulkResults];
                                                newResults[index].data.website = e.target.value;
                                                setBulkResults(newResults);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>Apply Link</Label>
                                        <Input
                                            value={result.data.apply_link}
                                            onChange={(e) => {
                                                const newResults = [...bulkResults];
                                                newResults[index].data.apply_link = e.target.value;
                                                setBulkResults(newResults);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Contact Email</Label>
                                        <Input
                                            value={result.data.contact_email}
                                            onChange={(e) => {
                                                const newResults = [...bulkResults];
                                                newResults[index].data.contact_email = e.target.value;
                                                setBulkResults(newResults);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>Contact Phone</Label>
                                        <Input
                                            value={result.data.contact_phone}
                                            onChange={(e) => {
                                                const newResults = [...bulkResults];
                                                newResults[index].data.contact_phone = e.target.value;
                                                setBulkResults(newResults);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={result.data.description}
                                        onChange={(e) => {
                                            const newResults = [...bulkResults];
                                            newResults[index].data.description = e.target.value;
                                            setBulkResults(newResults);
                                        }}
                                        rows={3}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Disciplines (comma-separated)</Label>
                                        <Input
                                            value={result.data.disciplines}
                                            onChange={(e) => {
                                                const newResults = [...bulkResults];
                                                newResults[index].data.disciplines = e.target.value;
                                                setBulkResults(newResults);
                                            }}
                                            placeholder="e.g. CS, Engineering, Arts"
                                        />
                                    </div>
                                    <div>
                                        <Label>Size (sq ft / acres)</Label>
                                        <Input
                                            value={result.data.size}
                                            onChange={(e) => {
                                                const newResults = [...bulkResults];
                                                newResults[index].data.size = e.target.value;
                                                setBulkResults(newResults);
                                            }}
                                            placeholder="e.g. 100 acres"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Icon URL</Label>
                                    <Input
                                        value={result.data.icon_url}
                                        onChange={(e) => {
                                            const newResults = [...bulkResults];
                                            newResults[index].data.icon_url = e.target.value;
                                            setBulkResults(newResults);
                                        }}
                                        placeholder="https://example.com/logo.png"
                                    />
                                    {result.data.icon_url && <img src={result.data.icon_url} alt="Preview" className="mt-2 h-16 w-16 object-contain rounded border" onError={(e) => (e.currentTarget.style.display = 'none')} />}
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
                                                        const newResults = [...bulkResults];
                                                        if (!newResults[index].images) newResults[index].images = [];
                                                        newResults[index].images!.push(file);
                                                        setBulkResults(newResults);
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
                                        {(result.data.university_images || []).filter((img: string) => img.trim() !== '').map((img: string, imgIndex: number) => (
                                            <div key={`url-${imgIndex}`} className="border rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Label className="text-sm text-muted-foreground">From Crawler (URL)</Label>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            const newResults = [...bulkResults];
                                                            const newImages = result.data.university_images?.filter((_: string, i: number) => i !== imgIndex) || [];
                                                            newResults[index].data.university_images = newImages;
                                                            setBulkResults(newResults);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                                <Input
                                                    value={img}
                                                    onChange={(e) => {
                                                        const newResults = [...bulkResults];
                                                        const newImages = [...(result.data.university_images || [])];
                                                        newImages[imgIndex] = e.target.value;
                                                        newResults[index].data.university_images = newImages;
                                                        setBulkResults(newResults);
                                                    }}
                                                    placeholder="Image URL"
                                                    className="mb-2"
                                                />
                                                {img && (
                                                    <img
                                                        src={img}
                                                        alt={`Preview ${imgIndex + 1}`}
                                                        className="mt-2 h-[200px] w-[200px] object-cover rounded"
                                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                )}
                                            </div>
                                        ))}

                                        {/* Show uploaded file images */}
                                        {(result.images || []).map((file, fileIndex) => (
                                            <div key={`file-${fileIndex}`} className="border rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Label className="text-sm text-muted-foreground">Uploaded File: {file.name}</Label>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            const newResults = [...bulkResults];
                                                            newResults[index].images = result.images!.filter((_, i) => i !== fileIndex);
                                                            setBulkResults(newResults);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Upload preview ${fileIndex + 1}`}
                                                    className="mt-2 h-[200px] w-[200px] object-cover rounded"
                                                />
                                            </div>
                                        ))}

                                        {(result.data.university_images?.filter((img: string) => img.trim() !== '').length === 0 && (!result.images || result.images.length === 0)) && (
                                            <p className="text-sm text-muted-foreground text-center py-4">No images added yet. Click "Add Image" to upload from your computer.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
