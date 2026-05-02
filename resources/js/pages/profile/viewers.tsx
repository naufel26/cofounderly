import { Head, Link, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ArrowLeft, Eye, UserCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

dayjs.extend(relativeTime);

interface Viewer {
    viewer: {
        id: number;
        name: string;
        tagline: string | null;
        role: string | null;
        profile_photo_url: string | null;
        connection_status?: string | null;
    };
    viewed_at: string;
}

interface PaginatedViewers {
    data: Viewer[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
}

export default function ProfileViewers() {
    const { viewers, total } = usePage().props as {
        viewers: PaginatedViewers;
        total: number;
    };

    const [pendingActions, setPendingActions] = useState<Set<number>>(new Set());
    const [connectionStates, setConnectionStates] = useState<Record<number, string | null>>({});

    const getStatus = (viewer: Viewer) =>
        connectionStates[viewer.viewer.id] ?? viewer.viewer.connection_status ?? null;

    const handleConnect = (userId: number) => {
        if (pendingActions.has(userId)) return;
        setPendingActions((s) => new Set(s).add(userId));

        router.post(
            `/connections/${userId}`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setConnectionStates((s) => ({ ...s, [userId]: 'sent_pending' })),
                onFinish: () => setPendingActions((s) => { const n = new Set(s); n.delete(userId); return n; }),
            },
        );
    };

    const handleAccept = (userId: number) => {
        if (pendingActions.has(userId)) return;
        setPendingActions((s) => new Set(s).add(userId));

        router.post(
            `/connections/${userId}/accept`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setConnectionStates((s) => ({ ...s, [userId]: 'accepted' })),
                onFinish: () => setPendingActions((s) => { const n = new Set(s); n.delete(userId); return n; }),
            },
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Head title="Who Viewed My Profile | Cofounderly" />
            <TopNavigation />

            <div className="mx-auto max-w-2xl px-4 pt-20 pb-16">
                {/* Back nav */}
                <div className="mb-4 flex items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-[#2DAB94]"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="text-sm font-medium text-slate-700">Profile Views</span>
                </div>

                {/* Header */}
                <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-teal-50">
                            <Eye className="size-5 text-[#2DAB94]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">Who Viewed Your Profile</h1>
                            <p className="text-sm text-slate-500">
                                {total} {total === 1 ? 'person has' : 'people have'} viewed your profile
                            </p>
                        </div>
                    </div>
                </div>

                {/* Viewers list */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                    {viewers.data.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-center">
                            <Eye className="mb-3 size-10 text-slate-200" />
                            <p className="font-semibold text-slate-700">No profile views yet</p>
                            <p className="mt-1 text-sm text-slate-400">
                                When someone views your profile, they'll appear here.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {viewers.data.map((item, idx) => {
                                const status = getStatus(item);
                                const isPending = pendingActions.has(item.viewer.id);

                                return (
                                    <li key={idx} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50">
                                        <Link href={`/profile/${item.viewer.id}`} className="shrink-0">
                                            <Avatar className="size-12 ring-2 ring-white transition-opacity hover:opacity-90">
                                                <AvatarImage src={item.viewer.profile_photo_url ?? undefined} />
                                                <AvatarFallback className="bg-slate-100 text-slate-600">
                                                    {item.viewer.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>

                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/profile/${item.viewer.id}`}
                                                className="text-[15px] font-bold text-slate-900 hover:underline"
                                            >
                                                {item.viewer.name}
                                            </Link>
                                            {(item.viewer.tagline || item.viewer.role) && (
                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                    {item.viewer.tagline ?? item.viewer.role}
                                                </p>
                                            )}
                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                Viewed {dayjs(item.viewed_at).fromNow()}
                                            </p>
                                        </div>

                                        {/* Connection action */}
                                        {status === 'accepted' ? (
                                            <span className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-[#2DAB94]">
                                                <UserCheck className="size-3.5" />
                                                Connected
                                            </span>
                                        ) : status === 'sent_pending' ? (
                                            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                                                Pending
                                            </span>
                                        ) : status === 'received_pending' ? (
                                            <button
                                                disabled={isPending}
                                                onClick={() => handleAccept(item.viewer.id)}
                                                className="rounded-full bg-[#2DAB94] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#249e89] disabled:opacity-60"
                                            >
                                                Accept
                                            </button>
                                        ) : status !== 'self' ? (
                                            <button
                                                disabled={isPending}
                                                onClick={() => handleConnect(item.viewer.id)}
                                                className="flex items-center gap-1.5 rounded-full border border-[#2DAB94] px-3 py-1.5 text-xs font-bold text-[#2DAB94] transition-colors hover:bg-teal-50 disabled:opacity-60"
                                            >
                                                <UserPlus className="size-3.5" />
                                                Connect
                                            </button>
                                        ) : null}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* Load more */}
                    {viewers.next_page_url && (
                        <div className="border-t border-slate-100 p-4 text-center">
                            <Link
                                href={viewers.next_page_url}
                                className="text-sm font-bold text-[#2DAB94] hover:underline"
                            >
                                Load more
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
