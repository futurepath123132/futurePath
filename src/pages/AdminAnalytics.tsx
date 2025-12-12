import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, GraduationCap, Award, TrendingUp, PieChart } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart as RePieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/ui/loader';

export default function AdminAnalytics() {
    const { user, loading, isAdmin } = useAuth();
    const { toast } = useToast();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalUniversities: 0,
        totalScholarships: 0,
    });
    const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
    const [studyModeData, setStudyModeData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && isAdmin) fetchAnalytics();
    }, [user, isAdmin]);

    const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
            // Fetch counts
            const { count: usersCount, data: users } = await supabase
                .from('profiles')
                .select('created_at', { count: 'exact' });

            const { count: uniCount, data: universities } = await supabase
                .from('universities')
                .select('study_mode', { count: 'exact' });

            const { count: scholCount } = await supabase
                .from('scholarships')
                .select('*', { count: 'exact', head: true });

            setStats({
                totalUsers: usersCount || 0,
                totalUniversities: uniCount || 0,
                totalScholarships: scholCount || 0,
            });

            // Process User Growth Data (Cumulative)
            if (users) {
                const sortedUsers = users
                    .map(u => new Date(u.created_at))
                    .sort((a, b) => a.getTime() - b.getTime());

                if (sortedUsers.length > 0) {
                    const growthMap = new Map<string, number>();
                    let cumulativeCount = 0;

                    // Group by date (YYYY-MM-DD)
                    sortedUsers.forEach(date => {
                        const dateKey = date.toISOString().split('T')[0];
                        cumulativeCount++;
                        growthMap.set(dateKey, cumulativeCount);
                    });

                    // Convert to array and take a subset if too large (e.g., last 30 distinct dates or simply all)
                    const growthArray = Array.from(growthMap.entries()).map(([date, count]) => ({
                        date,
                        users: count
                    }));

                    setUserGrowthData(growthArray);
                }
            }

            // Process Study Mode Data
            if (universities) {
                const modeCounts: Record<string, number> = {};
                universities.forEach((u: any) => {
                    const mode = u.study_mode || 'Unknown';
                    modeCounts[mode] = (modeCounts[mode] || 0) + 1;
                });

                const pieData = Object.entries(modeCounts).map(([name, value]) => ({
                    name,
                    value,
                }));
                setStudyModeData(pieData);
            }

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error fetching analytics',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) return <Loader center />;
    if (!user || !isAdmin) return <Navigate to="/" replace />;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Breadcrumbs />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link to="/admin" className="text-primary hover:underline mb-2 inline-block">← Back to Admin</Link>
                        <h1 className="text-4xl font-bold">Platform Analytics</h1>
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">Registered accounts</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Universities</CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUniversities}</div>
                            <p className="text-xs text-muted-foreground">Listed institutions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Scholarships</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalScholarships}</div>
                            <p className="text-xs text-muted-foreground">Available opportunities</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* User Growth Chart */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                User Growth
                            </CardTitle>
                            <CardDescription>Cumulative user registrations over time</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {isLoading ? (
                                <Loader center />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={userGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            minTickGap={30}
                                        />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip
                                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#8884d8"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Study Mode Distribution */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5" />
                                Study Modes
                            </CardTitle>
                            <CardDescription>Distribution of university study modes</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {isLoading ? (
                                <Loader center />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={studyModeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {studyModeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RePieChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
