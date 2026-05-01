import { router, usePage } from '@inertiajs/react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type NotificationItem = {
    id: string;
    type: string | null;
    title: string | null;
    actor_name: string | null;
    actor_photo: string | null;
    actor_id: number | null;
    action_url: string | null;
    read_at: string | null;
    created_at: string;
};

type NotificationsData = {
    unread_count: number;
    recent: NotificationItem[];
};

function timeAgo(iso: string): string {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export function NotificationDropdown() {
    const { notifications } = usePage().props as { notifications: NotificationsData };
    const [open, setOpen] = useState(false);

    const markRead = (id: string) => {
        router.patch(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const markAllRead = () => {
        router.patch('/notifications/read-all', {}, { preserveScroll: true });
    };

    const handleNotificationClick = (n: NotificationItem) => {
        if (!n.read_at) markRead(n.id);
        setOpen(false);
        if (n.action_url) router.visit(n.action_url);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
            >
                <Bell className="h-5 w-5" />
                {notifications.unread_count > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#F97316] text-[10px] font-bold text-white">
                        {notifications.unread_count > 9 ? '9+' : notifications.unread_count}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                            <h3 className="font-bold text-slate-900">Notifications</h3>
                            {notifications.unread_count > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="flex items-center gap-1 text-xs font-medium text-[#2DAB94] hover:underline"
                                >
                                    <CheckCheck className="size-3.5" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[420px] overflow-y-auto">
                            {notifications.recent.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                                    <Bell className="size-8 opacity-30" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.recent.map((n) => (
                                    <button
                                        key={n.id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${!n.read_at ? 'bg-[#E6F6F4]/40' : ''}`}
                                    >
                                        <div className="relative shrink-0">
                                            <Avatar className="size-10">
                                                <AvatarImage src={n.actor_photo ?? undefined} />
                                                <AvatarFallback className="bg-slate-200 text-xs">
                                                    {n.actor_name?.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {!n.read_at && (
                                                <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-[#2DAB94]" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] leading-snug text-slate-800">
                                                {n.title}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                {timeAgo(n.created_at)}
                                            </p>
                                        </div>
                                        {!n.read_at && (
                                            <span className="mt-1 size-2 shrink-0 rounded-full bg-[#2DAB94]" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
