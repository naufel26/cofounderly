import { useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

dayjs.extend(relativeTime);

interface CommentBoxProps {
    post: any;
}

export const CommentBox = ({ post }: CommentBoxProps) => {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;

    const {
        data,
        setData,
        post: submitComment,
        processing,
        reset,
    } = useForm({
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        submitComment(`/posts/${post.id}/comments`, {
            preserveScroll: true, // Keeps the user from jumping to the top of the page
            onSuccess: () => reset('content'),
        });
    };

    return (
        <div className="mt-2 animate-in duration-300 fade-in slide-in-from-top-2">
            {/* New Comment Input */}
            <form onSubmit={handleSubmit} className="mb-5 flex gap-3 px-1">
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={currentUser?.profile_photo_url} />
                    <AvatarFallback className="bg-slate-200 text-slate-600">
                        {currentUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-1 items-center gap-2 rounded-2xl bg-slate-50 px-3 py-1.5 transition-all focus-within:ring-2 focus-within:ring-[#2DAB94]/20">
                    <input
                        type="text"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 border-none bg-transparent px-1 py-1 text-sm focus:ring-0"
                    />
                    <button
                        type="submit"
                        disabled={processing || !data.content.trim()}
                        className="rounded-full p-1.5 text-[#2DAB94] transition-colors hover:bg-teal-50 disabled:opacity-50"
                    >
                        {processing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 px-1 pb-2">
                {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar className="mt-1 h-8 w-8 shrink-0">
                                <AvatarImage src={comment.user?.profile_photo_url} />
                                <AvatarFallback className="bg-slate-200 text-slate-600">
                                    {comment.user?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="inline-block rounded-2xl rounded-tl-none bg-slate-50 px-4 py-2.5 text-[14px]">
                                    <span className="mb-0.5 block font-bold text-slate-900">
                                        {comment.user?.name}
                                    </span>
                                    <span className="text-slate-700">
                                        {comment.content}
                                    </span>
                                </div>
                                <div className="mt-1 ml-2 flex gap-3 text-[11px] font-medium text-slate-400">
                                    <span>
                                        {dayjs(comment.created_at).fromNow()}
                                    </span>
                                    <button className="transition-colors hover:text-slate-600 hover:underline">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="py-2 text-center text-sm text-slate-400">
                        No comments yet. Be the first to start the conversation!
                    </p>
                )}
            </div>
        </div>
    );
};
