import { usePage, router } from '@inertiajs/react';
import {
    Image,
    Link2,
    Send,
    MoreHorizontal,
    ThumbsUp,
    MessageSquare,
    Share2,
    Plus,
    Type,
    Loader2,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import { PostSkeleton } from './PostSkeleton';
import { StatusBar } from './StatusBar';

export const CenterFeed = () => {
    const { auth, posts } = usePage().props as any;
    const user = auth.user;

    // State management
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [isLoadingInitial, setIsLoadingInitial] = useState(!posts); // For the Skeletons
    const [isLoadingMore, setIsLoadingMore] = useState(false); // For the bottom spinner

    const loadMoreRef = useRef<HTMLDivElement>(null);

    // 2. Handle Initial Lazy Load & Data Merging
    useEffect(() => {
        if (!posts) {
            // First visit: Fetch the initial page
            router.reload({
                only: ['posts'],
                onSuccess: () => setIsLoadingInitial(false),
                onFinish: () => setIsLoadingInitial(false),
            });
        } else {
            // Data has arrived: turn off loaders and merge posts
            setIsLoadingInitial(false);
            setIsLoadingMore(false);
            setAllPosts((prev) =>
                posts.current_page === 1
                    ? posts.data
                    : [...prev, ...posts.data],
            );
        }
    }, [posts]);

    // 3. Handle Infinite Scroll Trigger
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // If we hit the bottom target, have a next page, and aren't already loading
                if (
                    entries[0].isIntersecting &&
                    posts?.next_page_url &&
                    !isLoadingMore &&
                    !isLoadingInitial
                ) {
                    setIsLoadingMore(true);
                    router.reload({
                        data: { page: posts.current_page + 1 },
                        only: ['posts'],
                        preserveScroll: true, // Keep user at their current scroll position
                    });
                }
            },
            { threshold: 1.0 },
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [posts?.next_page_url, isLoadingMore, isLoadingInitial]);

    return (
        <div className="min-w-0 flex-1 space-y-4">
            <StatusBar />
            <CreatePost user={user} />
            {/* Render Initial Skeletons OR the Feed */}
            {isLoadingInitial ? (
                <>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </>
            ) : (
                <>
                    {/* Render actual posts */}
                    {allPosts.map((post) => (
                        <PostCard key={`post-${post.id}`} post={post} />
                    ))}

                    {/* 4. Bottom Target & Pagination Spinner */}
                    <div
                        ref={loadMoreRef}
                        className="flex h-20 items-center justify-center"
                    >
                        {isLoadingMore && (
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                <Loader2 className="h-5 w-5 animate-spin text-[#2DAB94]" />
                                Loading older posts...
                            </div>
                        )}
                        {!posts?.next_page_url && allPosts.length > 0 && (
                            <p className="text-sm text-slate-400">
                                You're all caught up!
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* 2. Main Feed Post - Sarah Chen */}
            <div className="card-elevated p-4 pb-2">
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex gap-3">
                        <Avatar className="h-12 w-12 rounded-full ring-2 ring-white">
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-[15px] font-bold text-slate-900">
                                    Sarah Chen
                                </h4>
                                <span className="rounded-md bg-[#E6F6F4] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#2DAB94] uppercase">
                                    Founder
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs leading-tight text-slate-500">
                                Building @FinFlow | YC W24 | Democratizing
                                financial planning
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                                2h ago
                            </p>
                        </div>
                    </div>
                    <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 px-1 text-[15px] leading-normal text-slate-700">
                    <p>
                        🚀 Excited to announce we just closed our $2M seed
                        round!
                    </p>
                    <p>
                        This journey started 18 months ago with just an idea and
                        a laptop. Today, we're serving 10,000+ users and growing
                        40% MoM.
                    </p>
                    <p>
                        Massive thanks to our investors, early adopters, and the
                        incredible team that made this possible.
                    </p>
                    <p className="cursor-pointer font-semibold text-[#2DAB94] hover:underline">
                        Looking for a senior backend engineer and growth
                        marketer to join us. DM if interested!
                    </p>
                </div>

                {/* Engagement Stats */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 px-1 pt-3 text-[13px] text-slate-400">
                    <span>234 likes</span>
                    <div className="flex gap-3">
                        <span>45 comments</span>
                        <span>12 shares</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-2 flex gap-1 border-t border-slate-50">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
                        <ThumbsUp className="h-4.5 w-4.5" /> Like
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
                        <MessageSquare className="h-4.5 w-4.5" /> Comment
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
                        <Share2 className="h-4.5 w-4.5" /> Share
                    </button>
                </div>
            </div>
            <div className="card-elevated p-4">
                <p className="mb-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Suggested for you
                </p>
                <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <Avatar className="h-12 w-12 rounded-full">
                            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" />
                            <AvatarFallback>AR</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-[15px] font-bold text-slate-900">
                                    Alex Rivera
                                </h4>
                                <span className="rounded-md bg-[#F3E8FF] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#9333EA] uppercase">
                                    Investor
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Partner @Elevation Ventures | Backing ambitious
                                founders
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                                4h ago
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="h-9 rounded-xl border-[#2DAB94] px-4 text-xs font-bold text-[#2DAB94] hover:bg-[#E6F6F4]"
                        >
                            <Plus className="mr-1.5 h-3.5 w-3.5" /> Connect
                        </Button>
                        <button className="rounded-full p-2 text-slate-400 hover:bg-slate-50">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="mt-4 space-y-3 px-1 text-[14px] leading-relaxed text-slate-700">
                    <p className="font-semibold text-slate-900">
                        What I look for in early-stage founders:
                    </p>
                    <ol className="ml-1 list-inside list-decimal space-y-1">
                        <li>Obsessive customer focus</li>
                        <li>Speed of execution</li>
                        <li>Ability to attract great talent</li>
                        <li>Intellectual honesty</li>
                        <li>Clear communication</li>
                    </ol>
                    <p className="mt-3">
                        Technical skills matter, but these traits matter more.
                        What would you add to this list?
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-50 px-1 pt-3 text-[13px] text-slate-400">
                    <span>567 likes</span>
                    <div className="flex gap-3">
                        <span>89 comments</span>
                        <span>34 shares</span>
                    </div>
                </div>

                <div className="mt-2 flex gap-1 border-t border-slate-50">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
                        <ThumbsUp className="h-4.5 w-4.5" /> Like
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
                        <MessageSquare className="h-4.5 w-4.5" /> Comment
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
                        <Share2 className="h-4.5 w-4.5" /> Share
                    </button>
                </div>
            </div>
        </div>
    );
};
