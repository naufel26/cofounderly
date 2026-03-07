import { usePage, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit2,
    UploadCloud,
    MapPin,
    Link2,
    CalendarDays,
    Users,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EditProfileModal } from './EditProfileModal'; // Adjust path accordingly

export default function Show() {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // const { post } = useForm();

    const { data, setData, post } = useForm({
        avatar: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Create a native browser FormData object
            const formData = new FormData();
            formData.append('avatar', file);

            setIsUploading(true);

            // Use router.post for direct multipart handling
            router.post('/profile/avatar', formData, {
                forceFormData: true,
                onSuccess: () => {
                    toast.success('Photo updated!');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                },
                onError: (errors) => {
                    toast.error(errors.avatar || 'Failed to upload photo');
                    console.error('Server Errors:', errors);
                },
                onFinish: () => {
                    setIsUploading(false);
                },
            });
        }
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
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-slate-900">
                        My Profile
                    </h1>

                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="h-10 gap-2 rounded-xl bg-[#2DAB94] px-5 font-bold text-white transition-all hover:bg-[#248d7a]"
                    >
                        <Edit2 className="h-4 w-4" /> Edit Profile
                    </Button>
                </div>
            </div>

            {/* Render the Modal here */}
            <EditProfileModal
                user={user}
                isOpen={isDialogOpen}
                onClose={setIsDialogOpen}
            />

            <div className="mx-auto mt-6 max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                {/* 2. Main Profile Header Card */}
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
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                    <Users className="h-4 w-4" /> 234
                                    connections
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About & Summary Sections */}
                <div className="card-elevated bg-white p-8">
                    <h4 className="mb-4 text-xl font-bold">About</h4>
                    <p className="text-slate-700">
                        {user?.bio || 'No bio provided.'}
                    </p>
                </div>

                <div className="card-elevated bg-white p-8">
                    <h4 className="mb-6 text-xl font-bold">
                        Professional Information
                    </h4>
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                Role
                            </p>
                            <span className="mt-2 inline-block rounded-lg bg-[#E6F6F4] px-3 py-1 text-xs font-bold text-[#2DAB94]">
                                {user?.role}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                Looking For
                            </p>
                            <p className="mt-2 font-bold text-slate-900">
                                {user?.looking_for}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
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
