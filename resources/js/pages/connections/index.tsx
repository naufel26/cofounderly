import { Head, Link, router, usePage } from '@inertiajs/react';
import { csrfToken } from '@/lib/utils';
import {
    Users,
    Clock,
    Send,
    UserX,
    UserPlus,
    UserCheck,
    MessageSquare,
    Check,
    X,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { ChatOverlay } from '@/components/chat/ChatOverlay';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type Tab = 'suggested' | 'connected' | 'pending' | 'sent' | 'ignored';

type ConnectionUser = {
    id: number;
    name: string;
    role: string | null;
    tagline: string | null;
    profile_photo_url: string;
};

type ConnectionItem = {
    connection_id: number;
    status: string;
    created_at: string;
    user: ConnectionUser;
};

type SuggestedUser = {
    id: number;
    name: string;
    role: string | null;
    tagline: string | null;
    profile_photo_url: string;
};

type Stats = {
    connected: number;
    pending_received: number;
    pending_sent: number;
    ignored: number;
};

function timeAgo(iso: string): string {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function ConnectionsIndex() {
    const { connected, pending_received, pending_sent, ignored, suggested, connection_stats } =
        usePage().props as {
            connected: ConnectionItem[];
            pending_received: ConnectionItem[];
            pending_sent: ConnectionItem[];
            ignored: ConnectionItem[];
            suggested: SuggestedUser[];
            connection_stats: Stats;
        };

    const initialTab: Tab = (() => {
        const params = new URLSearchParams(window.location.search);
        const t = params.get('tab') as Tab | null;
        return t && ['suggested', 'connected', 'pending', 'sent', 'ignored'].includes(t)
            ? t
            : 'suggested';
    })();

    const [activeTab, setActiveTab] = useState<Tab>(initialTab);
    const [pendingActions, setPendingActions] = useState<Set<number>>(new Set());

    const setLoading = (id: number, on: boolean) =>
        setPendingActions((prev) => {
            const next = new Set(prev);
            on ? next.add(id) : next.delete(id);
            return next;
        });

    const changeTab = (tab: Tab) => {
        setActiveTab(tab);
        window.history.replaceState({}, '', tab === 'suggested' ? '/connections' : `/connections?tab=${tab}`);
    };

    const accept = (userId: number) => {
        setLoading(userId, true);
        router.post(`/connections/${userId}/accept`, {}, {
            preserveScroll: true,
            onFinish: () => setLoading(userId, false),
        });
    };

    const ignore = (userId: number) => {
        setLoading(userId, true);
        router.post(`/connections/${userId}/ignore`, {}, {
            preserveScroll: true,
            onFinish: () => setLoading(userId, false),
        });
    };

    const remove = (userId: number) => {
        setLoading(userId, true);
        router.delete(`/connections/${userId}`, {
            preserveScroll: true,
            onFinish: () => setLoading(userId, false),
        });
    };

    const connect = (userId: number) => {
        setLoading(userId, true);
        router.post(`/connections/${userId}`, {}, {
            preserveScroll: true,
            onFinish: () => setLoading(userId, false),
        });
    };

    const openMessage = async (userId: number, name: string, photo: string) => {
        const res = await fetch(`/chat/conversations/${userId}`, {
            method: 'POST',
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        });
        if (res.ok) {
            const data = await res.json();
            window.dispatchEvent(
                new CustomEvent('open-chat-user', {
                    detail: {
                        id: data.conversation_id,
                        otherUser: { id: userId, name, profile_photo_url: photo },
                    },
                }),
            );
        }
    };

    const tabs: { key: Tab; label: string; count?: number; icon: React.ReactNode }[] = [
        { key: 'suggested', label: 'People You May Know', icon: <UserPlus className="size-4" /> },
        { key: 'connected', label: 'Connected', count: connection_stats.connected, icon: <Users className="size-4" /> },
        { key: 'pending', label: 'Pending', count: connection_stats.pending_received, icon: <Clock className="size-4" /> },
        { key: 'sent', label: 'Sent', count: connection_stats.pending_sent, icon: <Send className="size-4" /> },
        { key: 'ignored', label: 'Ignored', count: connection_stats.ignored, icon: <UserX className="size-4" /> },
    ];

    return (
        <>
            <div className="min-h-screen bg-slate-50">
                <Head title="Connections | Cofounderly" />
                <TopNavigation />

                <div className="mx-auto max-w-5xl px-4 pt-24 pb-16">
                    {/* Page header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-extrabold text-slate-900">My Network</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage your connections and discover new founders
                        </p>
                    </div>

                    <div className="flex gap-6">
                        {/* Left: Tab nav */}
                        <aside className="hidden w-56 shrink-0 lg:block">
                            <div className="sticky top-24 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-100">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => changeTab(tab.key)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                                            activeTab === tab.key
                                                ? 'bg-[#E6F6F4] text-[#2DAB94]'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <span className={activeTab === tab.key ? 'text-[#2DAB94]' : 'text-slate-400'}>
                                            {tab.icon}
                                        </span>
                                        <span className="flex-1">{tab.label}</span>
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                                    activeTab === tab.key
                                                        ? 'bg-[#2DAB94] text-white'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </aside>

                        {/* Mobile tab pills */}
                        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => changeTab(tab.key)}
                                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                                        activeTab === tab.key
                                            ? 'bg-[#2DAB94] text-white'
                                            : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-100'
                                    }`}
                                >
                                    {tab.label}
                                    {tab.count !== undefined && tab.count > 0 && (
                                        <span
                                            className={`rounded-full px-1.5 text-[10px] font-bold ${
                                                activeTab === tab.key ? 'bg-white/20' : 'bg-slate-100'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Right: Content */}
                        <div className="min-w-0 flex-1">
                            {/* ── People You May Know ── */}
                            {activeTab === 'suggested' && (
                                <div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {suggested.map((u) => (
                                            <SuggestionCard
                                                key={u.id}
                                                user={u}
                                                loading={pendingActions.has(u.id)}
                                                onConnect={() => connect(u.id)}
                                            />
                                        ))}
                                    </div>
                                    {suggested.length === 0 && (
                                        <EmptyState
                                            icon={<UserPlus className="size-10" />}
                                            title="No suggestions right now"
                                            body="Check back later as more founders join the platform."
                                        />
                                    )}
                                </div>
                            )}

                            {/* ── Connected ── */}
                            {activeTab === 'connected' && (
                                <div className="space-y-3">
                                    {connected.map((c) => (
                                        <ConnectionCard key={c.connection_id} item={c}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    openMessage(
                                                        c.user.id,
                                                        c.user.name,
                                                        c.user.profile_photo_url,
                                                    )
                                                }
                                                className="h-8 rounded-xl border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                                            >
                                                <MessageSquare className="mr-1.5 size-3.5" />
                                                Message
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={pendingActions.has(c.user.id)}
                                                onClick={() => remove(c.user.id)}
                                                className="h-8 rounded-xl border-slate-200 px-3 text-xs font-bold text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                            >
                                                {pendingActions.has(c.user.id) ? (
                                                    <Loader2 className="size-3.5 animate-spin" />
                                                ) : (
                                                    'Remove'
                                                )}
                                            </Button>
                                        </ConnectionCard>
                                    ))}
                                    {connected.length === 0 && (
                                        <EmptyState
                                            icon={<Users className="size-10" />}
                                            title="No connections yet"
                                            body="Start connecting with founders to grow your network."
                                        />
                                    )}
                                </div>
                            )}

                            {/* ── Pending Received ── */}
                            {activeTab === 'pending' && (
                                <div className="space-y-3">
                                    {pending_received.map((c) => (
                                        <ConnectionCard key={c.connection_id} item={c} badge="Wants to connect">
                                            <Button
                                                size="sm"
                                                disabled={pendingActions.has(c.user.id)}
                                                onClick={() => accept(c.user.id)}
                                                className="h-8 rounded-xl bg-[#2DAB94] px-3 text-xs font-bold text-white hover:bg-[#248d7a]"
                                            >
                                                {pendingActions.has(c.user.id) ? (
                                                    <Loader2 className="size-3.5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Check className="mr-1.5 size-3.5" />
                                                        Accept
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={pendingActions.has(c.user.id)}
                                                onClick={() => ignore(c.user.id)}
                                                className="h-8 rounded-xl border-slate-200 px-3 text-xs font-bold text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                            >
                                                <X className="mr-1 size-3.5" />
                                                Ignore
                                            </Button>
                                        </ConnectionCard>
                                    ))}
                                    {pending_received.length === 0 && (
                                        <EmptyState
                                            icon={<Clock className="size-10" />}
                                            title="No pending requests"
                                            body="You have no connection requests waiting for your response."
                                        />
                                    )}
                                </div>
                            )}

                            {/* ── Sent ── */}
                            {activeTab === 'sent' && (
                                <div className="space-y-3">
                                    {pending_sent.map((c) => (
                                        <ConnectionCard key={c.connection_id} item={c} badge="Request sent">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={pendingActions.has(c.user.id)}
                                                onClick={() => remove(c.user.id)}
                                                className="h-8 rounded-xl border-slate-200 px-3 text-xs font-bold text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                            >
                                                {pendingActions.has(c.user.id) ? (
                                                    <Loader2 className="size-3.5 animate-spin" />
                                                ) : (
                                                    'Withdraw'
                                                )}
                                            </Button>
                                        </ConnectionCard>
                                    ))}
                                    {pending_sent.length === 0 && (
                                        <EmptyState
                                            icon={<Send className="size-10" />}
                                            title="No sent requests"
                                            body="You haven't sent any connection requests yet."
                                        />
                                    )}
                                </div>
                            )}

                            {/* ── Ignored ── */}
                            {activeTab === 'ignored' && (
                                <div className="space-y-3">
                                    {ignored.map((c) => (
                                        <ConnectionCard key={c.connection_id} item={c} badge="Ignored">
                                            <Button
                                                size="sm"
                                                disabled={pendingActions.has(c.user.id)}
                                                onClick={() => accept(c.user.id)}
                                                className="h-8 rounded-xl bg-[#2DAB94] px-3 text-xs font-bold text-white hover:bg-[#248d7a]"
                                            >
                                                {pendingActions.has(c.user.id) ? (
                                                    <Loader2 className="size-3.5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <UserCheck className="mr-1.5 size-3.5" />
                                                        Accept
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={pendingActions.has(c.user.id)}
                                                onClick={() => remove(c.user.id)}
                                                className="h-8 rounded-xl border-slate-200 px-3 text-xs font-bold text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                            >
                                                Delete
                                            </Button>
                                        </ConnectionCard>
                                    ))}
                                    {ignored.length === 0 && (
                                        <EmptyState
                                            icon={<UserX className="size-10" />}
                                            title="No ignored requests"
                                            body="Requests you ignore will appear here."
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ChatOverlay />
        </>
    );
}

function SuggestionCard({
    user,
    loading,
    onConnect,
}: {
    user: SuggestedUser;
    loading: boolean;
    onConnect: () => void;
}) {
    return (
        <div className="flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md">
            <Link href={`/profile/${user.id}`}>
                <Avatar className="size-16 ring-2 ring-[#E6F6F4] ring-offset-2 transition-opacity hover:opacity-90">
                    <AvatarImage src={user.profile_photo_url} />
                    <AvatarFallback className="bg-[#E6F6F4] text-lg font-bold text-[#2DAB94]">
                        {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </Link>
            <Link href={`/profile/${user.id}`} className="mt-3 hover:underline">
                <p className="font-bold text-slate-900">{user.name}</p>
            </Link>
            {user.role && (
                <span className="mt-1 rounded-md bg-[#E6F6F4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2DAB94]">
                    {user.role}
                </span>
            )}
            {user.tagline && (
                <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-slate-500">{user.tagline}</p>
            )}
            <Button
                size="sm"
                disabled={loading}
                onClick={onConnect}
                className="mt-4 w-full rounded-xl bg-[#2DAB94] text-xs font-bold text-white hover:bg-[#248d7a] disabled:opacity-60"
            >
                {loading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                ) : (
                    <>
                        <UserPlus className="mr-1.5 size-3.5" />
                        Connect
                    </>
                )}
            </Button>
        </div>
    );
}

function ConnectionCard({
    item,
    badge,
    children,
}: {
    item: ConnectionItem;
    badge?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <Link href={`/profile/${item.user.id}`} className="shrink-0">
                <Avatar className="size-14 transition-opacity hover:opacity-90">
                    <AvatarImage src={item.user.profile_photo_url} />
                    <AvatarFallback className="bg-[#E6F6F4] font-bold text-[#2DAB94]">
                        {item.user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </Link>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={`/profile/${item.user.id}`}
                        className="font-bold text-slate-900 hover:underline"
                    >
                        {item.user.name}
                    </Link>
                    {item.user.role && (
                        <span className="rounded-md bg-[#E6F6F4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2DAB94]">
                            {item.user.role}
                        </span>
                    )}
                    {badge && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                            {badge}
                        </span>
                    )}
                </div>
                {item.user.tagline && (
                    <p className="mt-0.5 truncate text-xs text-slate-500">{item.user.tagline}</p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-400">{timeAgo(item.created_at)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">{children}</div>
        </div>
    );
}

function EmptyState({
    icon,
    title,
    body,
}: {
    icon: React.ReactNode;
    title: string;
    body: string;
}) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-slate-100">
            <span className="text-slate-300">{icon}</span>
            <p className="font-bold text-slate-700">{title}</p>
            <p className="max-w-xs text-sm text-slate-400">{body}</p>
        </div>
    );
}
