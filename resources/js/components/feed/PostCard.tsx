import dayjs from 'dayjs'; // Recommended for clean relative time (e.g., "2h ago")
import relativeTime from 'dayjs/plugin/relativeTime';
import { MoreHorizontal, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

dayjs.extend(relativeTime);

interface PostCardProps {
    post: any;
}

export const PostCard = ({ post }: PostCardProps) => {
    // Smart grid to handle different numbers of uploaded images
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
                          : 'grid-cols-2' // 3 or more images fallback to a 2-column grid
                }`}
            >
                {post.media.slice(0, 4).map((item: any, index: number) => {
                    // Logic to make the first image full width if there are exactly 3 images
                    const isThreeGridTop = mediaCount === 3 && index === 0;

                    return (
                        <div
                            key={item.id}
                            className={`relative bg-slate-100 ${isThreeGridTop ? 'col-span-2' : ''}`}
                        >
                            <img
                                src={`/storage/${item.file_path}`}
                                alt="Post attachment"
                                className={`w-full object-cover ${mediaCount === 1 ? 'max-h-[500px]' : 'h-64'}`}
                            />
                            {/* Overlay for +X more images if more than 4 are uploaded */}
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
        <div className="card-elevated p-4 pb-2">
            {/* 1. Header: User Info & Timestamp */}
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
                            {post.user?.role && (
                                <span className="rounded-md bg-[#E6F6F4] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#2DAB94] uppercase">
                                    {post.user.role}
                                </span>
                            )}
                        </div>
                        {post.user?.tagline && (
                            <p className="mt-0.5 text-xs leading-tight text-slate-500">
                                {post.user.tagline}
                            </p>
                        )}
                        <p className="mt-1 text-[11px] text-slate-400">
                            {dayjs(post.created_at).fromNow()}
                        </p>
                    </div>
                </div>
                <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            {/* 2. Body: Text Content */}
            {post.content && (
                <div className="space-y-4 px-1 text-[15px] leading-relaxed whitespace-pre-wrap text-slate-700">
                    {post.content}
                </div>
            )}

            {/* 3. Media: Uploaded Images Grid */}
            {renderMediaGrid()}

            {/* 4. Footer: Engagement Stats */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-50 px-1 pt-3 text-[13px] text-slate-400">
                <span>{post.likes_count || 0} likes</span>
                <div className="flex gap-3">
                    <span>{post.comments_count || 0} comments</span>
                    <span>{post.shares_count || 0} shares</span>
                </div>
            </div>

            {/* 5. Action Buttons */}
            <div className="mt-2 flex gap-1 border-t border-slate-50">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2DAB94]">
                    <ThumbsUp className="h-4.5 w-4.5" /> Like
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2DAB94]">
                    <MessageSquare className="h-4.5 w-4.5" /> Comment
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2DAB94]">
                    <Share2 className="h-4.5 w-4.5" /> Share
                </button>
            </div>
        </div>
    );
};
