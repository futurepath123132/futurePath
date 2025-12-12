
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScraperSourceConfig from '@/components/admin-scraper/ScraperSourceConfig';
import ScraperReview from '@/components/admin-scraper/ScraperReview';
import BulkScraperResults, { BulkResult } from '@/components/admin-scraper/BulkScraperResults';
import { processHtml } from '@/components/admin-scraper/utils';
import { Loader } from '@/components/ui/loader';

export default function AdminScraper() {
    const { user, loading, isAdmin } = useAuth();
    const { toast } = useToast();

    const [url, setUrl] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [scrapedData, setScrapedData] = useState<any>(null);
    const [type, setType] = useState<'scholarship' | 'university'>('scholarship');

    const [inputMethod, setInputMethod] = useState<'url' | 'html'>('url');
    const [htmlInput, setHtmlInput] = useState('');
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);

    // Bulk crawl state
    const [scrapeMode, setScrapeMode] = useState<'single' | 'bulk'>('single');
    const [bulkUrls, setBulkUrls] = useState('');
    const [bulkResults, setBulkResults] = useState<BulkResult[]>([]);
    const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number; currentUrl: string } | null>(null);
    const [isBulkScraping, setIsBulkScraping] = useState(false);

    if (loading) return <Loader center />;
    if (!user || !isAdmin) return <Navigate to="/" replace />;

    const handleScrape = async () => {
        if (inputMethod === 'html') {
            const data = processHtml(htmlInput, url, type, inputMethod);
            setScrapedData(data);
            toast({ title: 'Data Extracted', description: 'Please review the extracted data below.' });
            return;
        }

        if (!url) return;
        setIsScraping(true);
        setScrapedData(null);

        try {
            // Call local crawler server
            const response = await fetch('http://localhost:3000/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch data');
            }

            const data = await response.json();

            // Map API response to form state
            if (type === 'scholarship') {
                setScrapedData({
                    title: data.title,
                    provider: data.jsonLd?.name || '',
                    link: url,
                    description: data.description,
                    disciplines: data.heuristics.disciplines?.join(', ') || '',
                    documents_required: data.heuristics.documents_required?.join(', ') || '',
                    image_url: data.image_url || data.icon_url,
                });
            } else {
                setScrapedData({
                    name: data.title,
                    city: data.heuristics.city || '',
                    address: data.heuristics.address || '',
                    website: url,
                    tuition_range: '',
                    ranking: '',
                    description: data.description,
                    apply_link: url,
                    contact_email: data.heuristics.email || '',
                    contact_phone: data.heuristics.phone || '',
                    disciplines: data.heuristics.disciplines?.join(', ') || '',
                    programs: '',
                    icon_url: data.icon_url,
                    university_images: data.image_url ? [data.image_url] : [''],
                    size: data.heuristics.size || '',
                });
            }
            toast({ title: 'Data Extracted', description: 'Successfully fetched data from crawler server.' });

        } catch (error: any) {
            console.error('Scraping error:', error);
            toast({
                variant: 'destructive',
                title: 'Scraping Failed',
                description: error.message + '. Make sure the crawler server is running (npm run server).'
            });
        } finally {
            setIsScraping(false);
        }
    };

    const handleSave = async () => {
        if (!scrapedData) return;

        try {
            if (type === 'scholarship') {
                // Sanitize scholarship data
                const scholarshipData = {
                    title: scrapedData.title || 'Untitled Scholarship',
                    provider: scrapedData.provider || 'Unknown Provider',
                    amount: scrapedData.amount || null,
                    eligibility: scrapedData.eligibility || null,
                    deadline: scrapedData.deadline || null,
                    program_level: scrapedData.program_level || null,
                    link: scrapedData.link || null,
                    description: scrapedData.description || null,
                    disciplines: scrapedData.disciplines ? scrapedData.disciplines.split(',').map((d: string) => d.trim()).filter(Boolean) : [],
                    documents_required: scrapedData.documents_required ? scrapedData.documents_required.split(',').map((d: string) => d.trim()).filter(Boolean) : [],
                    created_by: user.id,
                    image_url: scrapedData.image_url || null,
                };

                const { error } = await supabase.from('scholarships').insert(scholarshipData);
                if (error) throw error;
                toast({ title: 'Success', description: 'Scholarship saved successfully' });

            } else {
                // Sanitize university data
                const rankingInt = parseInt(scrapedData.ranking);

                // Upload image files to Supabase storage
                let uploadedImageUrls: string[] = [];
                if (uploadedImages.length > 0) {
                    const safeName = scrapedData.name?.replace(/[^a-zA-Z0-9-_]/g, "_") || 'university';

                    for (const file of uploadedImages) {
                        const filePath = `${safeName}/${Date.now()}_${file.name}`;
                        const { error: uploadError } = await supabase.storage
                            .from('university-images')
                            .upload(filePath, file);

                        if (uploadError) {
                            toast({ variant: 'destructive', title: 'Upload error', description: uploadError.message });
                            continue;
                        }

                        const { data: publicUrlData } = supabase.storage
                            .from('university-images')
                            .getPublicUrl(filePath);
                        uploadedImageUrls.push(publicUrlData.publicUrl);
                    }
                }

                // Combine URL-based images with uploaded images
                const urlBasedImages = scrapedData.university_images?.filter((img: string) => img.trim() !== '') || [];
                const allImages = [...urlBasedImages, ...uploadedImageUrls];

                const universityData = {
                    name: scrapedData.name || 'Untitled University',
                    city: scrapedData.city || 'Unknown City',
                    address: scrapedData.address || null,
                    website: scrapedData.website || null,
                    tuition_range: scrapedData.tuition_range || null,
                    ranking: !isNaN(rankingInt) ? rankingInt : null,
                    description: scrapedData.description || null,
                    apply_link: scrapedData.apply_link || null,
                    contact_email: scrapedData.contact_email || null,
                    contact_phone: scrapedData.contact_phone || null,
                    disciplines: scrapedData.disciplines ? scrapedData.disciplines.split(',').map((d: string) => d.trim()).filter(Boolean) : [],
                    programs: scrapedData.programs ? scrapedData.programs.split(',').map((p: string) => p.trim()).filter(Boolean) : [],
                    created_by: user.id,
                    icon_url: scrapedData.icon_url || null,
                    images: allImages,
                    size: scrapedData.size || null,
                };

                const { error } = await supabase.from('universities').insert(universityData);
                if (error) throw error;
                toast({ title: 'Success', description: 'University saved successfully' });
            }

            setScrapedData(null);
            setUrl('');
            setUploadedImages([]);

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    const handleBulkCrawl = async () => {
        if (!bulkUrls.trim()) return;

        // Parse URLs (one per line, max 10)
        const urlList = bulkUrls.split('\n')
            .map(u => u.trim())
            .filter(u => u.length > 0)
            .slice(0, 10); // Limit to 10

        if (urlList.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please enter at least one URL' });
            return;
        }

        setIsBulkScraping(true);
        setBulkResults([]);
        const results: typeof bulkResults = [];

        for (let i = 0; i < urlList.length; i++) {
            const currentUrl = urlList[i];
            setBulkProgress({ current: i + 1, total: urlList.length, currentUrl });

            try {
                const response = await fetch('http://localhost:3000/api/scrape', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: currentUrl })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch data');
                }

                const data = await response.json();

                // Map to university data structure
                const universityData = {
                    name: data.title,
                    city: data.heuristics.city || '',
                    address: data.heuristics.address || '',
                    website: currentUrl,
                    tuition_range: '',
                    ranking: '',
                    description: data.description,
                    apply_link: currentUrl,
                    contact_email: data.heuristics.email || '',
                    contact_phone: data.heuristics.phone || '',
                    disciplines: data.heuristics.disciplines?.join(', ') || '',
                    programs: '',
                    icon_url: data.icon_url,
                    university_images: data.image_url ? [data.image_url] : [''],
                    size: data.heuristics.size || '',
                };

                results.push({
                    url: currentUrl,
                    status: 'success',
                    data: universityData,
                    images: []
                });

            } catch (error: any) {
                results.push({
                    url: currentUrl,
                    status: 'error',
                    error: error.message
                });
            }
        }

        setBulkResults(results);
        setBulkProgress(null);
        setIsBulkScraping(false);

        const successCount = results.filter(r => r.status === 'success').length;
        const errorCount = results.filter(r => r.status === 'error').length;

        toast({
            title: 'Bulk Crawl Complete',
            description: `${successCount} successful, ${errorCount} failed`
        });
    };

    const handleBulkSave = async () => {
        const successfulResults = bulkResults.filter(r => r.status === 'success');

        if (successfulResults.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'No successful results to save' });
            return;
        }

        let savedCount = 0;
        let errorCount = 0;

        for (const result of successfulResults) {
            try {
                const data = result.data;
                const rankingInt = parseInt(data.ranking);

                // Upload images if any
                let uploadedImageUrls: string[] = [];
                if (result.images && result.images.length > 0) {
                    const safeName = data.name?.replace(/[^a-zA-Z0-9-_]/g, "_") || 'university';

                    for (const file of result.images) {
                        const filePath = `${safeName}/${Date.now()}_${file.name}`;
                        const { error: uploadError } = await supabase.storage
                            .from('university-images')
                            .upload(filePath, file);

                        if (!uploadError) {
                            const { data: publicUrlData } = supabase.storage
                                .from('university-images')
                                .getPublicUrl(filePath);
                            uploadedImageUrls.push(publicUrlData.publicUrl);
                        }
                    }
                }

                // Combine URL-based images with uploaded images
                const urlBasedImages = data.university_images?.filter((img: string) => img.trim() !== '') || [];
                const allImages = [...urlBasedImages, ...uploadedImageUrls];

                const universityData = {
                    name: data.name || 'Untitled University',
                    city: data.city || 'Unknown City',
                    address: data.address || null,
                    website: data.website || null,
                    tuition_range: data.tuition_range || null,
                    ranking: !isNaN(rankingInt) ? rankingInt : null,
                    description: data.description || null,
                    apply_link: data.apply_link || null,
                    contact_email: data.contact_email || null,
                    contact_phone: data.contact_phone || null,
                    disciplines: data.disciplines ? data.disciplines.split(',').map((d: string) => d.trim()).filter(Boolean) : [],
                    programs: data.programs ? data.programs.split(',').map((p: string) => p.trim()).filter(Boolean) : [],
                    created_by: user.id,
                    icon_url: data.icon_url || null,
                    images: allImages,
                    size: data.size || null,
                };

                const { error } = await supabase.from('universities').insert(universityData);
                if (error) throw error;

                savedCount++;
            } catch (error: any) {
                console.error('Error saving university:', error);
                errorCount++;
            }
        }

        toast({
            title: 'Bulk Save Complete',
            description: `Saved ${savedCount} of ${successfulResults.length} universities`
        });

        if (savedCount > 0) {
            setBulkResults([]);
            setBulkUrls('');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Breadcrumbs />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link to="/admin" className="text-primary hover:underline mb-2 inline-flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Admin
                    </Link>
                    <h1 className="text-4xl font-bold text-foreground">Web Scraper</h1>
                    <p className="text-muted-foreground mt-2">Fetch data from external websites and add to database.</p>
                </div>

                <ScraperSourceConfig
                    type={type} setType={setType}
                    scrapeMode={scrapeMode} setScrapeMode={setScrapeMode}
                    inputMethod={inputMethod} setInputMethod={setInputMethod}
                    url={url} setUrl={setUrl}
                    htmlInput={htmlInput} setHtmlInput={setHtmlInput}
                    bulkUrls={bulkUrls} setBulkUrls={setBulkUrls}
                    isScraping={isScraping}
                    isBulkScraping={isBulkScraping}
                    handleScrape={handleScrape}
                    handleBulkCrawl={handleBulkCrawl}
                    bulkProgress={bulkProgress}
                />

                {scrapedData && scrapeMode !== 'bulk' && (
                    <ScraperReview
                        scrapedData={scrapedData}
                        setScrapedData={setScrapedData}
                        type={type}
                        uploadedImages={uploadedImages}
                        setUploadedImages={setUploadedImages}
                        handleSave={handleSave}
                    />
                )}

                {bulkResults.length > 0 && (
                    <BulkScraperResults
                        bulkResults={bulkResults}
                        setBulkResults={setBulkResults}
                        handleBulkSave={handleBulkSave}
                    />
                )}
            </div>
        </div>
    );
}
