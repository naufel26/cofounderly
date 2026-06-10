import { Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Eye,
    Search,
    Send,
    Users,
    UsersRound,
    UserX,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarLinkProps {
    icon: React.ReactNode;
    label: string;
    count?: number;
    href: string;
}

interface ConnectionStats {
    connected: number;
    pending_received: number;
    pending_sent: number;
}

type ProfileField = {
    key: string;
    label: string;
    done: boolean;
    href: string;
};

const SidebarLink = ({ icon, label, count, href }: SidebarLinkProps) => (
    <Link href={href} className="sidebar-link group w-full">
        <span className="flex items-center gap-3">
            <span className="text-muted-foreground group-hover:text-primary transition-colors">
                {icon}
            </span>
            <span className="text-sm font-medium">{label}</span>
        </span>
        {count !== undefined && (
            <span className="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary ml-auto rounded-full px-2 py-0.5 text-xs transition-colors">
                {count}
            </span>
        )}
    </Link>
);

function profileCompletion(user: any): ProfileField[] {
    return [
        {
            key: 'photo',
            label: 'Add a profile photo',
            done: !!user.avatar,
            href: '/profile',
        },
        {
            key: 'bio',
            label: 'Write a bio',
            done: !!user.bio && user.bio.trim().length > 0,
            href: '/profile#bio',
        },
        {
            key: 'skills',
            label: 'List your skills',
            done: Array.isArray(user.skills) && user.skills.length > 0,
            href: '/profile#skills',
        },
        {
            key: 'startup',
            label: 'Set your startup stage',
            done: !!user.stage && user.stage.trim().length > 0,
            href: '/profile#startup',
        },
    ];
}

export const LeftSidebar = () => {
    const { auth, connection_stats, profile_views_count } = usePage().props as {
        auth: { user: any };
        connection_stats?: ConnectionStats;
        profile_views_count?: number;
    };
    const user = auth?.user;
    const stats: ConnectionStats = connection_stats ?? { connected: 0, pending_received: 0, pending_sent: 0 };

    const fields = profileCompletion(user);
    const completedCount = fields.filter((f) => f.done).length;
    const completionPct = Math.round((completedCount / fields.length) * 100);
    const incomplete = fields.filter((f) => !f.done);

    return (
        <aside className="sticky top-20 h-fit w-64 shrink-0 space-y-4">
            {/* 1. Profile Card */}
            <div className="card-elevated overflow-hidden">
                <div className="bg-gradient-hero h-16" />
                <div className="px-4 pb-4">
                    <Link href="/profile">
                        <Avatar className="border-card -mt-8 h-16 w-16 border-4 shadow-sm transition-opacity hover:opacity-90">
                            <AvatarImage src={user.profile_photo_url} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {user.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Link>

                    <Link href="/profile" className="mt-3 block hover:underline">
                        <h3 className="text-foreground font-bold leading-tight">{user.name}</h3>
                    </Link>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {user.tagline || 'Building the future of startup ecosystems'}
                    </p>

                    {/* Profile completion */}
                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">Profile complete</span>
                            <span className="text-xs font-bold text-[#2DAB94]">{completionPct}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                            <div
                                className="h-full rounded-full bg-[#2DAB94] transition-all duration-500"
                                style={{ width: `${completionPct}%` }}
                            />
                        </div>

                        {incomplete.length > 0 && (
                            <ul className="mt-2.5 space-y-1.5">
                                {incomplete.map((f) => (
                                    <li key={f.key}>
                                        <Link
                                            href={f.href}
                                            className="flex items-center gap-2 text-[11px] text-slate-400 transition-colors hover:text-[#2DAB94]"
                                        >
                                            <Circle className="size-3 shrink-0 text-slate-300" />
                                            {f.label}
                                        </Link>
                                    </li>
                                ))}
                                {fields
                                    .filter((f) => f.done)
                                    .map((f) => (
                                        <li key={f.key} className="flex items-center gap-2 text-[11px] text-slate-300">
                                            <CheckCircle2 className="size-3 shrink-0 text-[#2DAB94]" />
                                            {f.label}
                                        </li>
                                    ))}
                            </ul>
                        )}

                        {completionPct === 100 && (
                            <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#2DAB94]">
                                <CheckCircle2 className="size-3" />
                                Profile complete!
                            </p>
                        )}
                    </div>

                    <div className="border-border mt-4 space-y-3 border-t pt-4">
                        <Link
                            href="/profile/viewers"
                            className="group flex w-full items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <Eye className="text-muted-foreground group-hover:text-primary h-4 w-4" />
                                <span className="text-muted-foreground group-hover:text-primary text-left text-xs transition-colors">
                                    Who viewed my profile
                                </span>
                            </div>
                            <span className="text-primary text-xs font-bold">{profile_views_count ?? 0}</span>
                        </Link>

                        <Link
                            href="/connections"
                            className="group flex w-full items-center justify-between"
                        >
                            <span className="text-muted-foreground group-hover:text-primary text-xs transition-colors">
                                Connections
                            </span>
                            <span className="text-primary text-xs font-bold">{stats.connected}</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Network Card */}
            <div className="card-elevated p-2">
                <h4 className="text-muted-foreground/70 px-3 py-2 text-[10px] font-bold uppercase tracking-widest">
                    Manage Your Network
                </h4>
                <div className="space-y-0.5">
                    <SidebarLink
                        href="/connections?tab=connected"
                        icon={<Users className="h-4 w-4" />}
                        label="Connected"
                        count={stats.connected}
                    />
                    <SidebarLink
                        href="/connections?tab=pending"
                        icon={<Clock className="h-4 w-4" />}
                        label="Pending"
                        count={stats.pending_received}
                    />
                    <SidebarLink
                        href="/connections?tab=ignored"
                        icon={<UserX className="h-4 w-4" />}
                        label="Ignored"
                    />
                    <SidebarLink
                        href="/connections?tab=sent"
                        icon={<Send className="h-4 w-4" />}
                        label="Sent"
                        count={stats.pending_sent}
                    />
                </div>
            </div>

            {/* 3. Advisor & Team Card */}
            <div className="card-elevated p-2">
                <h4 className="text-muted-foreground/70 px-3 py-2 text-[10px] font-bold uppercase tracking-widest">
                    Advisor & Team
                </h4>
                <div className="space-y-0.5">
                    <SidebarLink
                        href="/meetings"
                        icon={<Calendar className="h-4 w-4" />}
                        label="Manage meetings"
                    />
                    <Link
                        href="/advisors"
                        className="sidebar-link group w-full"
                    >
                        <span className="flex items-center gap-3">
                            <span className="text-muted-foreground group-hover:text-primary transition-colors">
                                <Search className="h-4 w-4" />
                            </span>
                            <span className="text-sm font-medium">Find an advisor</span>
                        </span>
                        <span className="ml-auto rounded-full bg-[#F1B981]/20 px-2 py-0.5 text-[10px] font-bold text-[#E8972A]">
                            New
                        </span>
                    </Link>
                    <SidebarLink
                        href="#"
                        icon={<UsersRound className="h-4 w-4" />}
                        label="Your team"
                    />
                </div>
            </div>
        </aside>
    );
};
