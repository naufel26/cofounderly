import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    MoreHorizontal,
    ThumbsUp,
    MessageSquare,
    Share2,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommentBox } from './CommentBox';

dayjs.extend(relativeTime);

interface PostCardProps {
    post: any;
}

export const PostCard = ({ post }: PostCardProps) => {
    // Optimistic Like State
    const [isLiked, setIsLiked] = useState(post.is_liked || false);
    const [likeCount, setLikeCount] = useState(post.likes_count || 0);

    // Lightbox State
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const [showComments, setShowComments] = useState(false);

    const handleLike = () => {
        // 1. Instantly update the UI (Optimistic Update)
        const previousLikedState = isLiked;
        setIsLiked(!previousLikedState);
        setLikeCount((prev: number) =>
            previousLikedState ? prev - 1 : prev + 1,
        );

        // 2. Send the request to the server in the background
        router.post(
            `/posts/${post.id}/like`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    // 3. Rollback the UI if the server request fails
                    setIsLiked(previousLikedState);
                    setLikeCount((prev: number) =>
                        previousLikedState ? prev + 1 : prev - 1,
                    );
                    toast.error('Failed to update like status.');
                },
            },
        );
    };

    const renderMediaGrid = () => {
        if (!post.media || post.media.length === 0) return null;
        const mediaCount = post.media.length;

        return (
            <div
                className={`mt-3 grid gap-1 overflow-hidden rounded-2xl ${
                    mediaCount === 1
                        ? 'grid-cols-1'
                        : mediaCount === 2
                          ? 'grid-cols-2'
                          : 'grid-cols-2'
                }`}
            >
                {post.media.slice(0, 4).map((item: any, index: number) => {
                    const isThreeGridTop = mediaCount === 3 && index === 0;
                    return (
                        <div
                            key={item.id}
                            onClick={() => setLightboxIndex(index)}
                            className={`relative cursor-pointer bg-slate-100 transition-opacity hover:opacity-95 ${isThreeGridTop ? 'col-span-2' : ''}`}
                        >
                            <img
                                src={`/storage/${item.file_path}`}
                                alt="Post attachment"
                                className={`w-full object-cover ${mediaCount === 1 ? 'max-h-[500px]' : 'h-64'}`}
                            />
                            {mediaCount > 4 && index === 3 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <span className="text-xl font-bold text-white">
                                        +{mediaCount - 4}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <div className="card-elevated p-4 pb-2">
                {/* Header Info */}
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex gap-3">
                        <Avatar className="h-12 w-12 rounded-full ring-2 ring-white">
                            <AvatarImage src={post.user?.profile_photo_url} />
                            <AvatarFallback className="bg-slate-100 text-slate-600">
                                {post.user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-[15px] font-bold text-slate-900">
                                    {post.user?.name}
                                </h4>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-400">
                                {dayjs(post.created_at).fromNow()}
                            </p>
                        </div>
                    </div>
                    <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>

                {/* Text Content */}
                {post.content && (
                    <div className="space-y-4 px-1 text-[15px] leading-relaxed whitespace-pre-wrap text-slate-700">
                        {post.content}
                    </div>
                )}

                {/* Render the Image Grid */}
                {renderMediaGrid()}

                {/* Engagement Stats */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 px-1 pt-3 text-[13px] text-slate-400">
                    <span>
                        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                    </span>
                    <div className="flex gap-3">
                        <span>{post.comments_count || 0} comments</span>
                        <span>{post.shares_count || 0} shares</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-2 flex gap-1 border-t border-slate-50">
                    <button
                        onClick={handleLike}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors hover:bg-slate-50 ${
                            isLiked
                                ? 'bg-teal-50/50 text-[#2DAB94]'
                                : 'text-slate-600 hover:text-[#2DAB94]'
                        }`}
                    >
                        {/* Fill the icon if liked */}
                        <ThumbsUp
                            className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`}
                        />
                        Like
                    </button>
                    {/* Toggle Comment Box Visibility */}
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors hover:bg-slate-50 ${
                            showComments
                                ? 'bg-teal-50/50 text-[#2DAB94]'
                                : 'text-slate-600 hover:text-[#2DAB94]'
                        }`}
                    >
                        <MessageSquare
                            className={`h-4.5 w-4.5 ${showComments ? 'fill-current' : ''}`}
                        />
                        Comment
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2DAB94]">
                        <Share2 className="h-4.5 w-4.5" /> Share
                    </button>
                    {/* Render the CommentBox conditionally */}
                    {showComments && <CommentBox post={post} />}
                </div>
            </div>

            {/* Lightbox Overlay */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <img
                        src={`/storage/${post.media[lightboxIndex].file_path}`}
                        alt="Enlarged view"
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                        onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing lightbox
                    />

                    {/* Next/Prev Navigation if multiple images exist */}
                    {post.media.length > 1 && (
                        <>
                            <button
                                className="absolute left-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) =>
                                        prev! > 0 ? prev! - 1 : prev,
                                    );
                                }}
                                disabled={lightboxIndex === 0}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                className="absolute right-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) =>
                                        prev! < post.media.length - 1
                                            ? prev! + 1
                                            : prev,
                                    );
                                }}
                                disabled={
                                    lightboxIndex === post.media.length - 1
                                }
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
};
