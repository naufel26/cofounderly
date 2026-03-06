import { usePage, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit2,
    UploadCloud,
    MapPin,
    Link2,
    CalendarDays,
    Users,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function Show() {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form for profile details - Unified destructuring
    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        last_name: user?.last_name || '',
        tagline: user?.tagline || '',
        location: user?.location || '',
        linkedin_url: user?.linkedin_url || '',
        bio: user?.bio || '',
        professional_summary: user?.professional_summary || '',
        role: user?.role || 'Founder',
        looking_for: user?.looking_for || 'Cofounder',
        business_stage: user?.business_stage || 'MVP',
        skills: user?.skills || [
            'Product Management',
            'Software Engineering',
            'Business Development',
        ],
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        post('/profile/update', {
            onSuccess: () => {
                setIsDialogOpen(false);
                toast.success('Profile updated successfully!');
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            // We use the same post helper from useForm but for a different endpoint
            post('/profile/avatar', {
                // @ts-ignore - manual addition for file upload
                avatar: file,
                forceFormData: true,
                onSuccess: () => {
                    setIsUploading(false);
                    toast.success('Photo updated!');
                },
                onError: () => setIsUploading(false),
            } as any);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setData(
            'skills',
            data.skills.filter((skill: string) => skill !== skillToRemove),
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Toaster position="top-right" />

            {/* Sub Header */}
            <div className="sticky top-0 z-40 border-b border-slate-100 bg-white shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <a
                        href="/feeds"
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Feed
                    </a>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 gap-2 rounded-xl bg-[#2DAB94] px-5 font-bold text-white transition-all hover:bg-[#248d7a]">
                                <Edit2 className="h-4 w-4" /> Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="dialog-wide flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border-none p-0">
                            <form
                                onSubmit={submitProfile}
                                className="flex h-full flex-col"
                            >
                                {/* Header - Stays fixed at top */}
                                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white p-6">
                                    <DialogTitle className="text-xl font-bold text-slate-900">
                                        Edit Profile
                                    </DialogTitle>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-xl bg-[#2DAB94] px-6 font-bold hover:bg-[#248d7a]"
                                    >
                                        Save Changes
                                    </Button>
                                </div>

                                {/* Content - Increased width & custom scrollbar */}
                                <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-8">
                                    {/* Basic Information Section */}
                                    <section className="space-y-6">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <h3 className="text-lg font-bold text-slate-800">
                                                Basic Information
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>First Name</Label>
                                                <Input
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 rounded-xl shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Last Name</Label>
                                                <Input
                                                    value={data.last_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'last_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 rounded-xl shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tagline</Label>
                                            <Input
                                                value={data.tagline}
                                                onChange={(e) =>
                                                    setData(
                                                        'tagline',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 rounded-xl shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input
                                                value={data.location}
                                                onChange={(e) =>
                                                    setData(
                                                        'location',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 rounded-xl shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>LinkedIn Profile URL</Label>
                                            <Input
                                                value={data.linkedin_url}
                                                onChange={(e) =>
                                                    setData(
                                                        'linkedin_url',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 rounded-xl shadow-sm"
                                            />
                                            <p className="text-[11px] text-slate-400">
                                                Recommended for credibility
                                            </p>
                                        </div>
                                    </section>

                                    {/* About Section */}
                                    <section className="space-y-4">
                                        <h3 className="border-b pb-2 text-lg font-bold text-slate-800">
                                            About
                                        </h3>
                                        <div className="space-y-2">
                                            <Label>Bio</Label>
                                            <Textarea
                                                value={data.bio}
                                                onChange={(e) =>
                                                    setData(
                                                        'bio',
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-[120px] resize-none rounded-xl"
                                            />
                                            <p className="text-right text-xs text-slate-400">
                                                {data.bio?.length || 0}/300
                                                characters
                                            </p>
                                        </div>
                                    </section>

                                    {/* Professional Info Selects */}
                                    <div className="space-y-4">
                                        <h3 className="border-b pb-2 font-bold text-slate-900">
                                            Professional Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Role</Label>
                                                <Select
                                                    value={data.role}
                                                    onValueChange={(v) =>
                                                        setData('role', v)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Founder">
                                                            Founder
                                                        </SelectItem>
                                                        <SelectItem value="Investor">
                                                            Investor
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Looking For</Label>
                                                <Select
                                                    value={data.looking_for}
                                                    onValueChange={(v) =>
                                                        setData(
                                                            'looking_for',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Cofounder">
                                                            Cofounder
                                                        </SelectItem>
                                                        <SelectItem value="Advisor">
                                                            Advisor
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>
                                                    Current Business Stage
                                                </Label>
                                                <Select
                                                    value={data.business_stage}
                                                    onValueChange={(v) =>
                                                        setData(
                                                            'business_stage',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Idea">
                                                            Idea
                                                        </SelectItem>
                                                        <SelectItem value="MVP">
                                                            MVP
                                                        </SelectItem>
                                                        <SelectItem value="Scaling">
                                                            Scaling
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Tags */}
                                    <div className="space-y-4 pb-6">
                                        <h3 className="border-b pb-2 font-bold text-slate-900">
                                            Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {data.skills.map(
                                                (skill: string) => (
                                                    <span
                                                        key={skill}
                                                        className="flex items-center gap-1 rounded-full bg-[#E6F6F4] px-3 py-1 text-xs font-bold text-[#2DAB94]"
                                                    >
                                                        {skill}{' '}
                                                        <X
                                                            className="h-3 w-3 cursor-pointer"
                                                            onClick={() =>
                                                                removeSkill(
                                                                    skill,
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mx-auto mt-6 max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="card-elevated overflow-hidden bg-white">
                    <div className="h-40 bg-gradient-to-r from-[#2DAB94] to-[#F1B981]" />
                    <div className="-mt-16 flex flex-col items-start gap-4 px-8 pb-8">
                        <div className="group relative">
                            <Avatar className="h-32 w-32 border-8 border-white shadow-lg ring-4 ring-white">
                                <AvatarImage
                                    src={user?.profile_photo_url}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-slate-200 text-5xl font-bold text-slate-600">
                                    {user?.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                {isUploading ? (
                                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white" />
                                ) : (
                                    <UploadCloud className="h-8 w-8" />
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl font-extrabold">
                                    {user?.name} {user?.last_name}
                                </h2>
                                <span className="rounded-lg bg-[#E6F6F4] px-2 py-0.5 text-xs font-bold text-[#2DAB94]">
                                    {user?.role}
                                </span>
                            </div>
                            <p className="text-slate-600">{user?.tagline}</p>
                            <div className="mt-3 flex gap-6 text-[13px] text-slate-500">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />{' '}
                                    {user?.location || 'No Location Set'}
                                </span>
                                <span className="flex items-center gap-1 text-teal-600">
                                    <Link2 className="h-4 w-4" /> LinkedIn
                                </span>
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="h-4 w-4" /> Joined
                                    January 2024
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Sections */}
                <div className="card-elevated bg-white p-8">
                    <h4 className="mb-4 text-xl font-bold">About</h4>
                    <p className="text-slate-700">
                        {user?.bio || 'No bio provided.'}
                    </p>
                </div>

                <div className="card-elevated bg-white p-8">
                    <h4 className="mb-4 text-xl font-bold">
                        Professional Summary
                    </h4>
                    <p className="text-slate-700">
                        {user?.professional_summary ||
                            'No professional summary provided.'}
                    </p>
                </div>

                {/* Professional Info Grid */}
                <div className="card-elevated bg-white p-8">
                    <h4 className="mb-6 text-xl font-bold">
                        Professional Information
                    </h4>
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Role
                            </p>
                            <span className="mt-2 inline-block rounded-lg bg-[#E6F6F4] px-3 py-1 text-xs font-bold text-[#2DAB94]">
                                {user?.role}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Looking For
                            </p>
                            <p className="mt-2 font-bold text-slate-900">
                                {user?.looking_for}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Business Stage
                            </p>
                            <p className="mt-2 font-bold text-slate-900">
                                {user?.business_stage}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Skills Chips */}
                <div className="card-elevated bg-white p-8">
                    <h4 className="mb-6 text-xl font-bold">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {user?.skills?.map((skill: string) => (
                            <span
                                key={skill}
                                className="rounded-full border border-teal-100 bg-[#E6F6F4]/50 px-4 py-1.5 text-sm font-medium text-[#2DAB94]"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
