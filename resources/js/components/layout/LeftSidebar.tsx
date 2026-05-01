import { Link, usePage } from '@inertiajs/react';
import {
    Eye,
    Users,
    Clock,
    UserX,
    Send,
    Calendar,
    Search,
    UsersRound,
    UserPlus,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarLinkProps {
    icon: React.ReactNode;
    label: string;
    count?: number;
}

interface ConnectionStats {
    connected: number;
    pending_received: number;
    pending_sent: number;
}

const SidebarLink = ({ icon, label, count }: SidebarLinkProps) => (
    <button className="sidebar-link group w-full">
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
    </button>
);

export const LeftSidebar = () => {
    const { auth, connection_stats } = usePage().props as { auth: { user: any }; connection_stats?: ConnectionStats };
    const user = auth?.user;
    const stats: ConnectionStats = connection_stats ?? { connected: 0, pending_received: 0, pending_sent: 0 };

    return (
        <aside className="sticky top-20 h-fit w-64 shrink-0 space-y-4">
            {/* 1. Main Profile Card */}
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
                        <h3 className="text-foreground font-bold leading-tight">
                            {user.name}
                        </h3>
                    </Link>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {user.tagline ||
                            'Building the future of startup ecosystems'}
                    </p>

                    <div className="border-border mt-4 space-y-3 border-t pt-4">
                        <button className="group flex w-full items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Eye className="text-muted-foreground group-hover:text-primary h-4 w-4" />
                                <span className="text-muted-foreground text-left text-xs">
                                    Who viewed my profile
                                </span>
                            </div>
                            <span className="text-primary text-xs font-bold">
                                24
                            </span>
                        </button>

                        <div className="flex w-full items-center justify-between">
                            <span className="text-muted-foreground text-xs">
                                Connections
                            </span>
                            <span className="text-primary text-xs font-bold">
                                {stats.connected}
                            </span>
                        </div>
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
                        icon={<Users className="h-4 w-4" />}
                        label="Connected"
                        count={stats.connected}
                    />
                    <SidebarLink
                        icon={<Clock className="h-4 w-4" />}
                        label="Pending"
                        count={stats.pending_received}
                    />
                    <SidebarLink
                        icon={<UserX className="h-4 w-4" />}
                        label="Ignored"
                        count={0}
                    />
                    <SidebarLink
                        icon={<Send className="h-4 w-4" />}
                        label="Sent"
                        count={stats.pending_sent}
                    />
                </div>
            </div>

            {/* 3. Advisor Card */}
            <div className="card-elevated p-2">
                <h4 className="text-muted-foreground/70 px-3 py-2 text-[10px] font-bold uppercase tracking-widest">
                    Advisor & Team
                </h4>
                <div className="space-y-0.5">
                    <SidebarLink
                        icon={<Calendar className="h-4 w-4" />}
                        label="Manage meetings"
                        count={2}
                    />
                    <SidebarLink
                        icon={<Search className="h-4 w-4" />}
                        label="Find an advisor"
                    />
                    <SidebarLink
                        icon={<UsersRound className="h-4 w-4" />}
                        label="Your team"
                        count={4}
                    />
                    <SidebarLink
                        icon={<UserPlus className="h-4 w-4" />}
                        label="Requested teams"
                        count={3}
                    />
                </div>
            </div>
        </aside>
    );
};
