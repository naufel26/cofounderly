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
        </div>
    );
};
