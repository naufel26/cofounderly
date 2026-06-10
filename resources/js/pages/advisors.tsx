import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Clock, Lightbulb, MapPin, Star, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { ChatOverlay } from '@/components/chat/ChatOverlay';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { csrfToken } from '@/lib/utils';

type ConnectionStatus = 'sent_pending' | 'received_pending' | 'accepted' | null;

type Advisor = {
    id: number;
    name: string;
    tagline: string | null;
    bio: string | null;
    profile_photo_url: string;
    skills: string[];
    location: string | null;
    connection_status: ConnectionStatus;
};

export default function Advisors() {
    const { advisors } = usePage().props as { advisors: Advisor[] };
    const [statuses, setStatuses] = useState<Record<number, ConnectionStatus>>(
        () => Object.fromEntries(advisors.map((a) => [a.id, a.connection_status])),
    );
    const [pending, setPending] = useState<Set<number>>(new Set());

    const connect = (advisorId: number) => {
        setPending((p) => new Set(p).add(advisorId));
        setStatuses((s) => ({ ...s, [advisorId]: 'sent_pending' }));
        fetch(`/connections/${advisorId}`, {
            method: 'POST',
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        })
            .catch(() => setStatuses((s) => ({ ...s, [advisorId]: null })))
            .finally(() => setPending((p) => { const n = new Set(p); n.delete(advisorId); return n; }));
    };

    const openMessage = (advisor: Advisor) => {
        fetch(`/chat/conversations/${advisor.id}`, {
            method: 'POST',
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        })
            .then((r) => r.json())
            .then((data) => {
                window.dispatchEvent(
                    new CustomEvent('open-chat-user', {
                        detail: {
                            id: data.conversation_id,
                            otherUser: { id: advisor.id, name: advisor.name, profile_photo_url: advisor.profile_photo_url },
                        },
                    }),
                );
            });
    };

    return (
        <>
            <div className="min-h-screen bg-background">
                <Head title="Find an Advisor | Cofounderly" />
                <TopNavigation />

                <div className="pt-20 pb-8">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex gap-6">
                            <div className="hidden w-64 shrink-0 lg:block">
                                <LeftSidebar />
                            </div>

                            <div className="min-w-0 flex-1">
                                {/* Hero */}
                                <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#2DAB94] to-[#1e8c77] p-6 text-white shadow-lg shadow-teal-100">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-white/20 p-3">
                                            <Star className="size-6" />
                                        </div>
                                        <div>
                                            <h1 className="text-xl font-extrabold">Find an Advisor</h1>
                                            <p className="mt-1 max-w-lg text-sm text-white/80">
                                                Connect with experienced advisors who have built and scaled businesses in Bangladesh.
                                                Get guidance on fundraising, product, hiring, and growth.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {['Fundraising', 'Product', 'Marketing', 'Tech', 'Operations', 'Legal'].map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {advisors.length === 0 ? (
                                    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white py-20 text-center shadow-sm ring-1 ring-slate-100">
                                        <div className="rounded-2xl bg-slate-100 p-5">
                                            <Lightbulb className="size-10 text-slate-300" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700">No advisors yet</p>
                                            <p className="mt-1 max-w-xs text-sm text-slate-400">
                                                Advisors will appear here once they join the platform.
                                                Check back soon.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => router.visit('/connections')}
                                            className="mt-2 rounded-xl bg-[#2DAB94] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#248d7a]"
                                        >
                                            Browse all founders
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                        {advisors.map((advisor) => (
                                            <AdvisorCard
                                                key={advisor.id}
                                                advisor={advisor}
                                                status={statuses[advisor.id]}
                                                isPending={pending.has(advisor.id)}
                                                onConnect={() => connect(advisor.id)}
                                                onMessage={() => openMessage(advisor)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChatOverlay />
        </>
    );
}

function AdvisorCard({
    advisor,
    status,
    isPending,
    onConnect,
    onMessage,
}: {
    advisor: Advisor;
    status: ConnectionStatus;
    isPending: boolean;
    onConnect: () => void;
    onMessage: () => void;
}) {
    return (
        <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md">
            <div className="flex items-start gap-3">
                <a href={`/profile/${advisor.id}`}>
                    <Avatar className="size-14 shrink-0 ring-2 ring-[#E6F6F4] ring-offset-2 transition-opacity hover:opacity-90">
                        <AvatarImage src={advisor.profile_photo_url} />
                        <AvatarFallback className="bg-[#E6F6F4] text-lg font-bold text-[#2DAB94]">
                            {advisor.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </a>
                <div className="min-w-0 flex-1">
                    <a href={`/profile/${advisor.id}`} className="hover:underline">
                        <p className="font-bold text-slate-900">{advisor.name}</p>
                    </a>
                    <span className="mt-0.5 inline-block rounded-md bg-[#E6F6F4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2DAB94]">
                        Advisor
                    </span>
                    {advisor.location && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                            <MapPin className="size-3" />
                            {advisor.location}
                        </p>
                    )}
                </div>
            </div>

            {advisor.tagline && (
                <p className="mt-3 text-[13px] font-medium text-slate-600">{advisor.tagline}</p>
            )}

            {advisor.bio && (
                <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-slate-500">{advisor.bio}</p>
            )}

            {advisor.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {advisor.skills.slice(0, 4).map((skill) => (
                        <span
                            key={skill}
                            className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                            {skill}
                        </span>
                    ))}
                    {advisor.skills.length > 4 && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-400">
                            +{advisor.skills.length - 4} more
                        </span>
                    )}
                </div>
            )}

            <div className="mt-4 flex gap-2">
                {status === 'accepted' ? (
                    <>
                        <button
                            onClick={onMessage}
                            className="flex-1 rounded-xl bg-[#2DAB94] py-2 text-xs font-bold text-white hover:bg-[#248d7a]"
                        >
                            Message
                        </button>
                        <span className="flex items-center gap-1 rounded-xl border border-[#E6F6F4] px-3 py-2 text-xs font-bold text-[#2DAB94]">
                            <CheckCircle2 className="size-3.5" />
                            Connected
                        </span>
                    </>
                ) : status === 'sent_pending' ? (
                    <span className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-400">
                        <Clock className="size-3.5" />
                        Request sent
                    </span>
                ) : status === 'received_pending' ? (
                    <button
                        onClick={onConnect}
                        className="flex-1 rounded-xl bg-[#2DAB94] py-2 text-xs font-bold text-white hover:bg-[#248d7a]"
                    >
                        Accept request
                    </button>
                ) : (
                    <button
                        onClick={onConnect}
                        disabled={isPending}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#2DAB94] py-2 text-xs font-bold text-[#2DAB94] transition-colors hover:bg-[#E6F6F4] disabled:opacity-60"
                    >
                        <UserPlus className="size-3.5" />
                        {isPending ? 'Connecting…' : 'Request intro'}
                    </button>
                )}
            </div>
        </div>
    );
}
