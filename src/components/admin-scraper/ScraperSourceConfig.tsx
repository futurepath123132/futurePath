
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Loader2 } from 'lucide-react';

interface ScraperSourceConfigProps {
    type: 'scholarship' | 'university';
    setType: (v: 'scholarship' | 'university') => void;
    scrapeMode: 'single' | 'bulk';
    setScrapeMode: (v: 'single' | 'bulk') => void;
    inputMethod: 'url' | 'html';
    setInputMethod: (v: 'url' | 'html') => void;
    url: string;
    setUrl: (v: string) => void;
    htmlInput: string;
    setHtmlInput: (v: string) => void;
    bulkUrls: string;
    setBulkUrls: (v: string) => void;
    isScraping: boolean;
    isBulkScraping: boolean;
    handleScrape: () => void;
    handleBulkCrawl: () => void;
    bulkProgress: { current: number; total: number; currentUrl: string } | null;
}

export default function ScraperSourceConfig({
    type, setType,
    scrapeMode, setScrapeMode,
    inputMethod, setInputMethod,
    url, setUrl,
    htmlInput, setHtmlInput,
    bulkUrls, setBulkUrls,
    isScraping, isBulkScraping,
    handleScrape, handleBulkCrawl,
    bulkProgress
}: ScraperSourceConfigProps) {
    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Source Configuration</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="w-full md:w-1/3">
                            <Label htmlFor="type">Content Type</Label>
                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scholarship">Scholarship</SelectItem>
                                    <SelectItem value="university">University</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {type === 'university' && (
                            <div className="w-full md:w-1/3">
                                <Label htmlFor="scrapeMode">Scrape Mode</Label>
                                <Select value={scrapeMode} onValueChange={(v: any) => setScrapeMode(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">Single URL</SelectItem>
                                        <SelectItem value="bulk">Bulk Crawl (up to 10)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {scrapeMode === 'single' && (
                            <div className="w-full md:w-1/3">
                                <Label htmlFor="method">Input Method</Label>
                                <Select value={inputMethod} onValueChange={(v: any) => setInputMethod(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="url">Fetch URL</SelectItem>
                                        <SelectItem value="html">Paste HTML</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {scrapeMode === 'bulk' && type === 'university' ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="bulkUrls">University URLs (one per line, max 10)</Label>
                                <Textarea
                                    id="bulkUrls"
                                    placeholder={"https://lums.edu.pk\nhttps://nust.edu.pk\nhttps://fast.edu.pk"}
                                    value={bulkUrls}
                                    onChange={(e) => setBulkUrls(e.target.value)}
                                    rows={8}
                                    disabled={isBulkScraping}
                                />
                                <p className="text-sm text-muted-foreground">
                                    {bulkUrls.split('\n').filter(u => u.trim().length > 0).length} / 10 URLs
                                </p>
                            </div>

                            <Button
                                onClick={handleBulkCrawl}
                                disabled={isBulkScraping || !bulkUrls.trim()}
                                className="w-full"
                            >
                                {isBulkScraping ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Crawling...
                                    </>
                                ) : (
                                    <>
                                        <Globe className="mr-2 h-4 w-4" />
                                        Start Bulk Crawl
                                    </>
                                )}
                            </Button>

                            {bulkProgress && (
                                <div className="border rounded-lg p-4 bg-muted/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">
                                            Processing {bulkProgress.current} of {bulkProgress.total}
                                        </span>
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {bulkProgress.currentUrl}
                                    </p>
                                    <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="bg-primary h-full transition-all duration-300"
                                            style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {inputMethod === 'url' ? (
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <Label htmlFor="url">Target URL</Label>
                                        <Input
                                            id="url"
                                            placeholder="https://example.com/scholarship-details"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleScrape} disabled={isScraping || !url}>
                                        {isScraping ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
                                        Fetch Data
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label htmlFor="html">Paste HTML Content</Label>
                                    <Textarea
                                        id="html"
                                        placeholder="Paste the source code or text content here..."
                                        value={htmlInput}
                                        onChange={(e) => setHtmlInput(e.target.value)}
                                        rows={6}
                                    />
                                    <Button onClick={handleScrape} disabled={!htmlInput}>
                                        Process HTML
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
