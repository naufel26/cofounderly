import { Head, Link, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    MoreHorizontal,
    Share2,
    ThumbsUp,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ChatOverlay } from '@/components/chat/ChatOverlay';
import { CommentBox } from '@/components/feed/CommentBox';
import { ConnectButton, type ConnectionStatus } from '@/components/feed/ConnectButton';
import { ShareModal } from '@/components/feed/ShareModal';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

dayjs.extend(relativeTime);

export default function PostShow() {
    const { auth, post, post_url } = usePage().props as any;

    const [isLiked, setIsLiked] = useState<boolean>(post.is_liked ?? false);
    const [likeCount, setLikeCount] = useState<number>(post.likes_count ?? 0);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [showShare, setShowShare] = useState(false);

    const handleLike = () => {
        const prev = isLiked;
        setIsLiked(!prev);
        setLikeCount((c: number) => (prev ? c - 1 : c + 1));
        router.post(`/posts/${post.id}/like`, {}, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setIsLiked(prev);
                setLikeCount((c: number) => (prev ? c + 1 : c - 1));
                toast.error('Failed to update like.');
            },
        });
    };

    return (
        <>
            <div className="min-h-screen bg-slate-50">
                <Head>
                    <title>{post.user?.name}'s Post | Cofounderly</title>
                    <meta name="description" content={post.content ? post.content.slice(0, 160) : `A post by ${post.user?.name} on Cofounderly`} />
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={`${post.user?.name}'s Post | Cofounderly`} />
                    <meta property="og:description" content={post.content ? post.content.slice(0, 160) : `A post by ${post.user?.name}`} />
                    <meta property="og:image" content={post.media?.[0] ? `/storage/${post.media[0].file_path}` : post.user?.profile_photo_url} />
                    <meta property="og:url" content={post_url} />
                    <meta name="twitter:card" content={post.media?.length ? 'summary_large_image' : 'summary'} />
                    <meta name="twitter:title" content={`${post.user?.name}'s Post | Cofounderly`} />
                    <meta name="twitter:description" content={post.content ? post.content.slice(0, 160) : ''} />
                    <meta name="twitter:image" content={post.media?.[0] ? `/storage/${post.media[0].file_path}` : post.user?.profile_photo_url} />
                </Head>
                <TopNavigation />

                <div className="mx-auto max-w-2xl px-4 pt-20 pb-16">
                    {/* Back navigation */}
                    <div className="mb-4 flex items-center gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-[#2DAB94]"
                        >
                            <ArrowLeft className="size-4" />
                            Back
                        </button>
                        <span className="text-slate-300">/</span>
                        <span className="text-sm font-medium text-slate-700">Post</span>
                    </div>

                    {/* Post card */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                        {/* Header */}
                        <div className="flex items-start justify-between p-5 pb-4">
                            <div className="flex gap-3">
                                <Link href={`/profile/${post.user?.id}`} className="shrink-0">
                                    <Avatar className="size-12 ring-2 ring-white transition-opacity hover:opacity-90">
                                        <AvatarImage src={post.user?.profile_photo_url} />
                                        <AvatarFallback className="bg-slate-100 text-slate-600">
                                            {post.user?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link
                                        href={`/profile/${post.user?.id}`}
                                        className="text-[15px] font-bold text-slate-900 hover:underline"
                                    >
                                        {post.user?.name}
                                    </Link>
                                    {post.user?.tagline && (
                                        <p className="mt-0.5 text-xs text-slate-500">{post.user.tagline}</p>
                                    )}
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        {dayjs(post.created_at).fromNow()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {post.user?.id !== auth?.user?.id && (
                                    <ConnectButton
                                        userId={post.user?.id}
                                        connectionStatus={post.connection_status as ConnectionStatus}
                                    />
                                )}
                                <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50">
                                    <MoreHorizontal className="size-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {post.content && (
                            <div className="whitespace-pre-wrap px-5 pb-3 text-[15px] leading-relaxed text-slate-700">
                                {post.content}
                            </div>
                        )}

                        {/* Media grid */}
                        {post.media && post.media.length > 0 && (
                            <div
                                className={`grid gap-1 ${
                                    post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                                }`}
                            >
                                {post.media.slice(0, 4).map((item: any, idx: number) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setLightboxIndex(idx)}
                                        className={`relative cursor-pointer bg-slate-100 transition-opacity hover:opacity-95 ${
                                            post.media.length === 3 && idx === 0 ? 'col-span-2' : ''
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${item.file_path}`}
                                            alt="Post attachment"
                                            className={`w-full object-cover ${post.media.length === 1 ? 'max-h-[600px]' : 'h-64'}`}
                                        />
                                        {post.media.length > 4 && idx === 3 && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                <span className="text-xl font-bold text-white">+{post.media.length - 4}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[13px] text-slate-400">
                            <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                            <span>{post.comments_count ?? post.comments?.length ?? 0} comments</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 border-t border-slate-100 px-2">
                            <button
                                onClick={handleLike}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors hover:bg-slate-50 ${
                                    isLiked ? 'bg-teal-50/50 text-[#2DAB94]' : 'text-slate-600 hover:text-[#2DAB94]'
                                }`}
                            >
                                <ThumbsUp className={`size-4 ${isLiked ? 'fill-current' : ''}`} />
                                Like
                            </button>
                            <a
                                href="#comments"
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2DAB94]"
                            >
                                <MessageSquare className="size-4" />
                                Comment
                            </a>
                            <div className="relative flex flex-1">
                                <button
                                    onClick={() => setShowShare((v) => !v)}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors hover:bg-slate-50 ${
                                        showShare ? 'bg-teal-50/50 text-[#2DAB94]' : 'text-slate-600 hover:text-[#2DAB94]'
                                    }`}
                                >
                                    <Share2 className="size-4" />
                                    Share
                                </button>
                                {showShare && (
                                    <ShareModal
                                        postId={post.id}
                                        postUrl={post_url}
                                        postContent={post.content}
                                        onClose={() => setShowShare(false)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Comments section */}
                        <div id="comments" className="border-t border-slate-100 px-5 py-4">
                            <h3 className="mb-4 text-sm font-bold text-slate-700">
                                Comments{post.comments?.length > 0 ? ` (${post.comments.length})` : ''}
                            </h3>
                            <CommentBox post={post} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <X className="size-6" />
                    </button>
                    <img
                        src={`/storage/${post.media[lightboxIndex].file_path}`}
                        alt="Enlarged view"
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {post.media.length > 1 && (
                        <>
                            <button
                                className="absolute left-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
                                disabled={lightboxIndex === 0}
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => p! > 0 ? p! - 1 : p); }}
                            >
                                <ChevronLeft className="size-6" />
                            </button>
                            <button
                                className="absolute right-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
                                disabled={lightboxIndex === post.media.length - 1}
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => p! < post.media.length - 1 ? p! + 1 : p); }}
                            >
                                <ChevronRight className="size-6" />
                            </button>
                        </>
                    )}
                </div>
            )}

            <ChatOverlay />
        </>
    );
}
