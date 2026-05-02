import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    CalendarDays,
    Edit2,
    Globe,
    Link2,
    MapPin,
    Plus,
    Trash2,
    UploadCloud,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ChatOverlay } from '@/components/chat/ChatOverlay';
import { MessageButton } from '@/components/chat/MessageButton';
import { ConnectButton, type ConnectionStatus } from '@/components/feed/ConnectButton';
import { CreateStatusModal } from '@/components/feed/CreateStatusModal';
import { PostCard } from '@/components/feed/PostCard';
import { PostSkeleton } from '@/components/feed/PostSkeleton';
import { StatusViewer, type StatusItem } from '@/components/feed/StatusViewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { csrfToken } from '@/lib/utils';
import { EditProfileModal } from './EditProfileModal';

type Tab = 'posts' | 'experience' | 'about';

interface ExperienceEntry {
    id?: string;
    title: string;
    company: string;
    from_date?: string;
    to_date?: string;
    is_current?: boolean;
    description?: string;
}

export default function Show() {
    const { auth, profile_user, is_own_profile, connection_status, connection_stats, posts, active_status } =
        usePage().props as any;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isCoverUploading, setIsCoverUploading] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('posts');
    const [statusCreateOpen, setStatusCreateOpen] = useState(false);
    const [statusViewerOpen, setStatusViewerOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<StatusItem | null>(active_status ?? null);

    // --- Posts lazy-load state ---
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(!posts);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Trigger initial lazy load when Posts tab is active and data not yet fetched
    useEffect(() => {
        if (activeTab === 'posts' && !posts) {
            router.reload({
                only: ['posts'],
                onStart: () => setIsLoadingPosts(true),
                onFinish: () => setIsLoadingPosts(false),
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // Merge new page data when posts prop updates
    useEffect(() => {
        if (!posts) return;
        setIsLoadingPosts(false);
        setIsLoadingMore(false);
        setAllPosts((prev) =>
            posts.current_page === 1 ? posts.data : [...prev, ...posts.data],
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    posts?.next_page_url &&
                    !isLoadingMore &&
                    !isLoadingPosts
                ) {
                    setIsLoadingMore(true);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    router.reload({ data: { page: posts.current_page + 1 }, only: ['posts'] } as any);
                }
            },
            { threshold: 1.0 },
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [posts?.next_page_url, isLoadingMore, isLoadingPosts]);

    const handleStatusCreated = (status: StatusItem) => setCurrentStatus(status);

    const handleDeleteStatus = async () => {
        if (!currentStatus) return;
        await fetch(`/statuses/${currentStatus.id}`, {
            method: 'DELETE',
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        });
        setCurrentStatus(null);
        setStatusViewerOpen(false);
    };

    const handleAvatarClick = () => {
        if (!is_own_profile && currentStatus) {
            setStatusViewerOpen(true);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsCoverUploading(true);
        const formData = new FormData();
        formData.append('cover_photo', file);

        router.post('/profile/cover-photo', formData, {
            forceFormData: true,
            onSuccess: () => toast.success('Cover photo updated!'),
            onError: (errors) => toast.error(errors.cover_photo || 'Upload failed'),
            onFinish: () => {
                setIsCoverUploading(false);
                if (coverInputRef.current) coverInputRef.current.value = '';
            },
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        router.post('/profile/avatar', formData, {
            forceFormData: true,
            onSuccess: () => toast.success('Photo updated!'),
            onError: (errors) => toast.error(errors.avatar || 'Upload failed'),
            onFinish: () => {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const tabs: { key: Tab; label: string }[] = [
        { key: 'posts', label: 'Posts' },
        { key: 'experience', label: 'Experience' },
        { key: 'about', label: 'About' },
    ];

    return (
        <>
        <div className="min-h-screen bg-slate-50 pb-20">
            <Head>
            <title>{`${profile_user?.name} — ${profile_user?.tagline ?? profile_user?.role ?? 'Member'} | Cofounderly`}</title>
            <meta name="description" content={profile_user?.bio ?? profile_user?.tagline ?? `${profile_user?.name} is on Cofounderly — Bangladesh's startup community.`} />
            <meta property="og:type" content="profile" />
            <meta property="og:title" content={`${profile_user?.name} | Cofounderly`} />
            <meta property="og:description" content={profile_user?.bio ?? profile_user?.tagline ?? `${profile_user?.name} is building on Cofounderly.`} />
            <meta property="og:image" content={profile_user?.profile_photo_url} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={`${profile_user?.name} | Cofounderly`} />
            <meta name="twitter:description" content={profile_user?.bio ?? profile_user?.tagline ?? ''} />
            <meta name="twitter:image" content={profile_user?.profile_photo_url} />
        </Head>

            {/* Sub-header */}
            <div className="sticky top-0 z-40 border-b border-slate-100 bg-white shadow-sm">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
                    <a
                        href="/feeds"
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#2DAB94]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Feed
                    </a>
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-900">
                        {is_own_profile ? 'My Profile' : profile_user?.name}
                    </h1>
                    {is_own_profile ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => currentStatus ? setStatusViewerOpen(true) : setStatusCreateOpen(true)}
                                className={`flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-colors ${
                                    currentStatus
                                        ? 'bg-gradient-to-r from-[#2DAB94] to-teal-400 text-white'
                                        : 'border border-slate-200 text-slate-600 hover:border-[#2DAB94] hover:text-[#2DAB94]'
                                }`}
                            >
                                {currentStatus ? (
                                    <span className="size-2 rounded-full bg-white/70" />
                                ) : (
                                    <Plus className="size-3.5" />
                                )}
                                {currentStatus ? 'My Status' : 'Add Status'}
                            </button>
                            <Button
                                onClick={() => setIsEditOpen(true)}
                                className="h-9 gap-2 rounded-xl bg-[#2DAB94] px-4 text-sm font-bold text-white hover:bg-[#248d7a]"
                            >
                                <Edit2 className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <MessageButton
                                userId={profile_user?.id}
                                userName={profile_user?.name}
                                userPhoto={profile_user?.profile_photo_url}
                            />
                            <ConnectButton
                                userId={profile_user?.id}
                                connectionStatus={connection_status as ConnectionStatus}
                            />
                        </div>
                    )}
                </div>
            </div>

            {is_own_profile && (
                <EditProfileModal
                    user={auth?.user}
                    isOpen={isEditOpen}
                    onClose={setIsEditOpen}
                />
            )}

            <div className="mx-auto mt-6 max-w-4xl space-y-4 px-4">
                {/* Profile Header Card */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                    {/* Cover photo */}
                    <div className="group relative h-44">
                        {profile_user?.cover_photo_url ? (
                            <img
                                src={profile_user.cover_photo_url}
                                alt="Cover"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-r from-[#2DAB94] to-[#F1B981]" />
                        )}

                        {is_own_profile && (
                            <>
                                <button
                                    onClick={() => coverInputRef.current?.click()}
                                    className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 text-sm font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    {isCoverUploading ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                                    ) : (
                                        <>
                                            <UploadCloud className="h-5 w-5" />
                                            {profile_user?.cover_photo_url ? 'Change Cover Photo' : 'Add Cover Photo'}
                                        </>
                                    )}
                                </button>
                                <input
                                    type="file"
                                    ref={coverInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                />
                            </>
                        )}
                    </div>
                    <div className="-mt-16 px-8 pb-6">
                        <div className="flex items-end justify-between">
                            <div className="group relative">
                                {/* Status ring — gradient if has status */}
                                <div
                                    className={`inline-flex rounded-full p-[3px] ${
                                        currentStatus
                                            ? 'bg-gradient-to-tr from-[#2DAB94] via-teal-400 to-[#F1B981]'
                                            : 'bg-transparent'
                                    }`}
                                    onClick={handleAvatarClick}
                                    style={{ cursor: !is_own_profile && currentStatus ? 'pointer' : 'default' }}
                                >
                                    <div className="rounded-full bg-white p-[3px]">
                                        <Avatar className="h-24 w-24 shadow-md">
                                            <AvatarImage
                                                src={profile_user?.profile_photo_url}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-slate-200 text-4xl font-bold text-slate-600">
                                                {profile_user?.name?.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                {is_own_profile && (
                                    <>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            {isUploading ? (
                                                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                                            ) : (
                                                <UploadCloud className="h-7 w-7" />
                                            )}
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-extrabold text-slate-900">
                                    {profile_user?.name}
                                </h2>
                                {profile_user?.role && (
                                    <span className="rounded-lg bg-[#E6F6F4] px-2 py-0.5 text-xs font-bold text-[#2DAB94]">
                                        {profile_user.role}
                                    </span>
                                )}
                            </div>

                            {profile_user?.tagline && (
                                <p className="mt-1 text-slate-600">{profile_user.tagline}</p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-slate-500">
                                {profile_user?.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {profile_user.location}
                                    </span>
                                )}
                                {profile_user?.linkedin_url && (
                                    <a
                                        href={profile_user.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[#2DAB94] hover:underline"
                                    >
                                        <Link2 className="h-3.5 w-3.5" />
                                        LinkedIn
                                    </a>
                                )}
                                {profile_user?.website && (
                                    <a
                                        href={profile_user.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[#2DAB94] hover:underline"
                                    >
                                        <Globe className="h-3.5 w-3.5" />
                                        Website
                                    </a>
                                )}
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                    <Users className="h-3.5 w-3.5" />
                                    {connection_stats?.connected ?? 0} connections
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                    <div className="flex border-b border-slate-100 px-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-4 text-sm font-bold transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-b-2 border-[#2DAB94] text-[#2DAB94]'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                        <div className="space-y-4 p-4">
                            {isLoadingPosts ? (
                                <>
                                    <PostSkeleton />
                                    <PostSkeleton />
                                </>
                            ) : allPosts.length === 0 ? (
                                <p className="py-12 text-center text-sm text-slate-400">
                                    No posts yet.
                                </p>
                            ) : (
                                <>
                                    {allPosts.map((post) => (
                                        <PostCard key={`post-${post.id}`} post={post} />
                                    ))}
                                    <div
                                        ref={loadMoreRef}
                                        className="flex h-12 items-center justify-center"
                                    >
                                        {isLoadingMore && (
                                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[#2DAB94]" />
                                        )}
                                        {!posts?.next_page_url && allPosts.length > 0 && (
                                            <p className="text-xs text-slate-400">
                                                All posts loaded
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Experience Tab */}
                    {activeTab === 'experience' && (
                        <div className="p-6">
                            {profile_user?.experience?.length > 0 ? (
                                <div className="space-y-6">
                                    {(profile_user.experience as ExperienceEntry[]).map(
                                        (entry, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6F6F4]">
                                                        <Briefcase className="h-5 w-5 text-[#2DAB94]" />
                                                    </div>
                                                    {idx < profile_user.experience.length - 1 && (
                                                        <div className="mt-2 w-0.5 flex-1 bg-slate-100" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <p className="font-bold text-slate-900">
                                                        {entry.title}
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        {entry.company}
                                                    </p>
                                                    {(entry.from_date || entry.to_date) && (
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                                            <CalendarDays className="h-3 w-3" />
                                                            {entry.from_date}
                                                            {entry.from_date && ' – '}
                                                            {entry.is_current
                                                                ? 'Present'
                                                                : entry.to_date}
                                                        </p>
                                                    )}
                                                    {entry.description && (
                                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                                            {entry.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="py-12 text-center text-sm text-slate-400">
                                    {is_own_profile
                                        ? 'Add your experience to help others know your background.'
                                        : 'No experience listed yet.'}
                                </p>
                            )}
                        </div>
                    )}

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div className="space-y-6 p-6">
                            {profile_user?.bio && (
                                <div>
                                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Bio
                                    </h4>
                                    <p className="text-sm leading-relaxed text-slate-700">
                                        {profile_user.bio}
                                    </p>
                                </div>
                            )}

                            {profile_user?.professional_summary && (
                                <div>
                                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Professional Summary
                                    </h4>
                                    <p className="text-sm leading-relaxed text-slate-700">
                                        {profile_user.professional_summary}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                                {profile_user?.role && (
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Role
                                        </p>
                                        <span className="mt-1.5 inline-block rounded-lg bg-[#E6F6F4] px-3 py-1 text-xs font-bold text-[#2DAB94]">
                                            {profile_user.role}
                                        </span>
                                    </div>
                                )}
                                {profile_user?.looking_for && (
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Looking For
                                        </p>
                                        <p className="mt-1.5 text-sm font-semibold text-slate-800">
                                            {Array.isArray(profile_user.looking_for)
                                                ? profile_user.looking_for.join(', ')
                                                : profile_user.looking_for}
                                        </p>
                                    </div>
                                )}
                                {profile_user?.business_stage && (
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Business Stage
                                        </p>
                                        <p className="mt-1.5 text-sm font-semibold text-slate-800">
                                            {profile_user.business_stage}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {profile_user?.skills?.length > 0 && (
                                <div>
                                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {profile_user.skills.map((skill: string) => (
                                            <span
                                                key={skill}
                                                className="rounded-full border border-teal-100 bg-[#E6F6F4]/60 px-3 py-1 text-xs font-medium text-[#2DAB94]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {statusCreateOpen && (
            <CreateStatusModal
                onClose={() => setStatusCreateOpen(false)}
                onCreated={(s) => { handleStatusCreated(s); setStatusCreateOpen(false); }}
            />
        )}

        {statusViewerOpen && currentStatus && (
            <StatusViewer
                statuses={[currentStatus]}
                startIndex={0}
                onClose={() => setStatusViewerOpen(false)}
                onViewed={() => {}}
                extraActions={
                    is_own_profile ? (
                        <button
                            onClick={handleDeleteStatus}
                            className="flex items-center gap-1.5 rounded-xl bg-red-500/80 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500"
                        >
                            <Trash2 className="size-3.5" />
                            Delete Status
                        </button>
                    ) : undefined
                }
            />
        )}

        <ChatOverlay />
        </>
    );
}
