import { Head, router, usePage } from '@inertiajs/react';
import { ArrowRight, Search, Share2, UploadCloud, UserPlus, Users, Zap } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Logo } from '@/components/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ROLE_LABELS: Record<string, string> = {
    founder: 'Founder',
    cofounder: 'Co-founder',
    investor: 'Investor',
    jobseeker: 'Job Seeker',
    student: 'Student',
    advisor: 'Advisor',
};

const ROLE_INTROS: Record<string, string> = {
    founder: 'Your startup journey starts here. Build your dream team and bring your vision to life.',
    cofounder: "Great co-founders are rare. You're in the right place to find the perfect match.",
    investor: 'Discover early-stage startups and connect with the next generation of founders.',
    jobseeker: 'Find exciting startup roles with equity upside and real impact.',
    student: 'Start your entrepreneurial journey. Learn, connect, and build alongside the best.',
    advisor: 'Share your expertise with founders who need your guidance the most.',
};

const quickActions = [
    {
        icon: UserPlus,
        title: 'Build your network',
        description: 'Find and connect with founders, investors, and co-founders.',
        href: '/connections',
        color: 'bg-teal-50 text-[#2DAB94]',
    },
    {
        icon: Share2,
        title: 'Share your story',
        description: "Post an update, insight, or what you're working on right now.",
        href: '/feeds',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: Search,
        title: 'Explore the feed',
        description: 'See what the Cofounderly community is building and talking about.',
        href: '/feeds',
        color: 'bg-violet-50 text-violet-600',
    },
    {
        icon: Users,
        title: 'Complete your profile',
        description: 'Add your bio, skills, and experience to stand out.',
        href: '/profile',
        color: 'bg-amber-50 text-amber-600',
    },
];

export default function Onboarding() {
    const { user } = usePage().props as { user: any };
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>(user?.profile_photo_url ?? '');
    const [completing, setCompleting] = useState(false);

    const roleLabel = ROLE_LABELS[user?.role] ?? user?.role ?? 'Member';
    const intro = ROLE_INTROS[user?.role] ?? "Welcome to Bangladesh's premier startup community.";

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optimistic preview
        const objectUrl = URL.createObjectURL(file);
        setAvatarUrl(objectUrl);

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        router.post('/profile/avatar', formData, {
            forceFormData: true,
            onSuccess: () => toast.success('Photo uploaded!'),
            onError: () => {
                setAvatarUrl(user?.profile_photo_url ?? '');
                toast.error('Upload failed. Please try again.');
            },
            onFinish: () => {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const handleComplete = () => {
        setCompleting(true);
        router.post('/onboarding/complete', {}, {
            onFinish: () => setCompleting(false),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Head title="Welcome to Cofounderly" />

            {/* Top bar */}
            <div className="border-b border-slate-100 bg-white px-6 py-4">
                <Logo size="md" />
            </div>

            <div className="mx-auto max-w-2xl px-4 py-12">
                {/* Welcome card */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                    {/* Gradient header */}
                    <div className="relative h-32 bg-gradient-to-r from-[#2DAB94] to-[#F1B981]">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                        />
                        <div className="absolute -bottom-12 left-8">
                            <div className="group relative">
                                <Avatar className="size-24 ring-4 ring-white shadow-lg">
                                    <AvatarImage src={avatarUrl} className="object-cover" />
                                    <AvatarFallback className="bg-slate-200 text-3xl font-bold text-slate-600">
                                        {user?.name?.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                    title="Upload photo"
                                >
                                    {isUploading
                                        ? <div className="size-5 animate-spin rounded-full border-b-2 border-white" />
                                        : <UploadCloud className="size-6" />
                                    }
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pt-16 pb-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900">
                                    Welcome, {user?.name?.split(' ')[0]}! 🎉
                                </h1>
                                <span className="mt-1 inline-block rounded-lg bg-[#E6F6F4] px-2.5 py-1 text-xs font-bold text-[#2DAB94]">
                                    {roleLabel}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                                <Zap className="size-3 text-amber-500" />
                                New member
                            </div>
                        </div>

                        <p className="mt-4 text-slate-600 leading-relaxed">
                            {intro}
                        </p>

                        {!user?.avatar && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 transition-colors hover:border-[#2DAB94] hover:text-[#2DAB94]"
                            >
                                <UploadCloud className="size-4" />
                                Add a profile photo to stand out
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick start actions */}
                <div className="mt-6">
                    <h2 className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-slate-400">
                        Quick start
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {quickActions.map((action) => (
                            <a
                                key={action.title}
                                href={action.href}
                                className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
                            >
                                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${action.color}`}>
                                    <action.icon className="size-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{action.title}</p>
                                    <p className="mt-0.5 text-sm text-slate-500">{action.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleComplete}
                        disabled={completing}
                        className="flex items-center gap-2 rounded-2xl bg-[#2DAB94] px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-200 transition-all hover:bg-[#249e89] hover:shadow-teal-300 disabled:opacity-70"
                    >
                        {completing
                            ? <div className="size-5 animate-spin rounded-full border-b-2 border-white" />
                            : <>Start Exploring <ArrowRight className="size-5" /></>
                        }
                    </button>
                </div>

                <p className="mt-4 text-center text-xs text-slate-400">
                    You can always update your profile later
                </p>
            </div>
        </div>
    );
}
