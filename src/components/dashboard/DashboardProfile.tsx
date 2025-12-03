import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Pencil } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import { Profile } from './types';

interface DashboardProfileProps {
    user: any;
    profile: Profile;
    setProfile: (profile: Profile) => void;
    onProfileUpdate: () => void;
}

export default function DashboardProfile({ user, profile, setProfile, onProfileUpdate }: DashboardProfileProps) {
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState<Record<string, boolean>>({});

    const toggleEdit = (field: string) => {
        setEditMode(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const emailPending = user?.new_email;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Update email (Supabase sends verification email automatically)
            if (profile.email !== user?.email) {
                const { error: emailError } = await supabase.auth.updateUser({
                    email: profile.email,
                });
                if (emailError) throw emailError;
                toast({
                    title: 'Verification Required',
                    description: `A verification link has been sent to ${profile.email}. Please verify to complete the email change.`,
                });
            }

            // Update profile table
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user?.id,
                    full_name: profile.full_name,
                    city: profile.city,
                    email: profile.email,
                    date_of_birth: profile.date_of_birth || null,
                    gender: profile.gender || null,
                    nationality: profile.nationality || null,
                    phone: profile.phone || null,
                    state: profile.state || null,
                    zip_code: profile.zip_code || null,
                    address: profile.address || null,
                    preferred_discipline: profile.preferred_discipline || null,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast({
                title: 'Success',
                description: 'Profile updated successfully',
            });

            // Refresh suggestions
            onProfileUpdate();

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Profile Picture Upload */}
                <div className="mb-6 pb-6 border-b">
                    <ProfilePictureUpload
                        userId={user.id}
                        currentImageUrl={profile.profilepic}
                        userName={profile.full_name}
                        onImageUpdate={(newUrl) => setProfile({ ...profile, profilepic: newUrl })}
                    />
                </div>

                <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="full_name"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    placeholder="e.g. Shaveer Sajjad"
                                    disabled={!editMode['full_name']}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleEdit('full_name')}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date Of Birth</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="dob"
                                    type="date"
                                    value={profile.date_of_birth}
                                    onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                                    disabled={!editMode['date_of_birth']}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleEdit('date_of_birth')}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Select
                                        value={profile.gender}
                                        onValueChange={(value) => setProfile({ ...profile, gender: value })}
                                        disabled={!editMode['gender']}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleEdit('gender')}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Select
                                        value={profile.nationality}
                                        onValueChange={(value) => setProfile({ ...profile, nationality: value })}
                                        disabled={!editMode['nationality']}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pakistani">Pakistani</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleEdit('nationality')}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="preferred_discipline">Preferred Discipline</Label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Select
                                        value={profile.preferred_discipline}
                                        onValueChange={(value) => setProfile({ ...profile, preferred_discipline: value })}
                                        disabled={!editMode['preferred_discipline']}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Engineering">Engineering</SelectItem>
                                            <SelectItem value="Business">Business</SelectItem>
                                            <SelectItem value="Arts">Arts</SelectItem>
                                            <SelectItem value="Medical">Medical</SelectItem>
                                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleEdit('preferred_discipline')}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile.email}
                                        disabled={!editMode['email'] || (emailPending ? true : false)}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleEdit('email')}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                                {emailPending && (
                                    <p className="text-sm text-yellow-500 mt-1">
                                        Verification pending: Check <b>{emailPending}</b> to confirm email change.
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="phone"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="----------"
                                        disabled={!editMode['phone']}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleEdit('phone')}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Select
                                            value={profile.state}
                                            onValueChange={(value) => setProfile({ ...profile, state: value })}
                                            disabled={!editMode['state']}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Punjab">Punjab</SelectItem>
                                                <SelectItem value="Sindh">Sindh</SelectItem>
                                                <SelectItem value="KPK">KPK</SelectItem>
                                                <SelectItem value="Balochistan">Balochistan</SelectItem>
                                                <SelectItem value="Gilgit-Baltistan">Gilgit-Baltistan</SelectItem>
                                                <SelectItem value="Azad Kashmir">Azad Kashmir</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleEdit('state')}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="city"
                                        value={profile.city}
                                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                        placeholder="e.g., Lahore"
                                        disabled={!editMode['city']}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleEdit('city')}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip_code">Zip Code</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="zip_code"
                                        value={profile.zip_code}
                                        onChange={(e) => setProfile({ ...profile, zip_code: e.target.value })}
                                        placeholder="------"
                                        disabled={!editMode['zip_code']}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleEdit('zip_code')}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="address"
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        placeholder="------"
                                        disabled={!editMode['address']}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleEdit('address')}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving} className="bg-[#2700D3] hover:bg-[#2700D3]/90">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
