import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Lock, LogOut, ChevronDown } from 'lucide-react';
import { getInitials } from '@/lib/storage';

interface ProfileData {
    full_name: string;
    profilepic: string | null;
}

export default function ProfileDropdown() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfileData>({ full_name: '', profilepic: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, profilepic')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            const userMetaData = user?.user_metadata || {};

            setProfile({
                full_name: data?.full_name || userMetaData.full_name || userMetaData.name || user.email?.split('@')[0] || 'User',
                profilepic: data?.profilepic || null,
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback to user metadata
            const userMetaData = user?.user_metadata || {};
            setProfile({
                full_name: userMetaData.full_name || userMetaData.name || user.email?.split('@')[0] || 'User',
                profilepic: null,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
    };

    const initials = getInitials(profile.full_name);

    if (loading || !user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                {/* Profile Picture */}
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                    {profile.profilepic ? (
                        <img
                            src={profile.profilepic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-sm font-semibold text-primary">{initials}</span>
                    )}
                </div>

                {/* User Name */}
                <span className="text-sm font-medium hidden md:inline">{profile.full_name}</span>

                {/* Dropdown Arrow */}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                        <div>
                            {profile.profilepic ? (
                                <img
                                    src={profile.profilepic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-semibold text-primary">{initials}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{profile.full_name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Show Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/change-password')} className="cursor-pointer">
                    <Lock className="mr-2 h-4 w-4" />
                    <span>Reset Password</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
