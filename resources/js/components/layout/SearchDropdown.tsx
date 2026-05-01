import { router } from '@inertiajs/react';
import { Search, UserPlus, Clock, UserCheck, Users, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { csrfToken } from '@/lib/utils';

type ConnectionStatus = 'sent_pending' | 'received_pending' | 'accepted' | null;

type SearchUser = {
    id: number;
    name: string;
    role: string | null;
    tagline: string | null;
    profile_photo_url: string;
    connection_status: ConnectionStatus;
};

function useDebounce(value: string, delay: number) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export function SearchDropdown() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [statuses, setStatuses] = useState<Record<number, ConnectionStatus>>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }

        setLoading(true);
        fetch(`/search/users?q=${encodeURIComponent(debouncedQuery)}`, {
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        })
            .then((r) => r.json())
            .then((data: SearchUser[]) => {
                setResults(data);
                const map: Record<number, ConnectionStatus> = {};
                data.forEach((u) => { map[u.id] = u.connection_status; });
                setStatuses(map);
                setOpen(true);
            })
            .finally(() => setLoading(false));
    }, [debouncedQuery]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleConnect = (e: React.MouseEvent, userId: number) => {
        e.stopPropagation();
        setStatuses((prev) => ({ ...prev, [userId]: 'sent_pending' }));
        fetch(`/connections/${userId}`, {
            method: 'POST',
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        }).catch(() => {
            setStatuses((prev) => ({ ...prev, [userId]: null }));
        });
    };

    const handleCancel = (e: React.MouseEvent, userId: number) => {
        e.stopPropagation();
        setStatuses((prev) => ({ ...prev, [userId]: null }));
        fetch(`/connections/${userId}`, {
            method: 'DELETE',
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        }).catch(() => {
            setStatuses((prev) => ({ ...prev, [userId]: 'sent_pending' }));
        });
    };

    const handleAccept = (e: React.MouseEvent, userId: number) => {
        e.stopPropagation();
        setStatuses((prev) => ({ ...prev, [userId]: 'accepted' }));
        fetch(`/connections/${userId}/accept`, {
            method: 'POST',
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        }).catch(() => {
            setStatuses((prev) => ({ ...prev, [userId]: 'received_pending' }));
        });
    };

    const goToProfile = (userId: number) => {
        setOpen(false);
        setQuery('');
        router.visit(`/profile/${userId}`);
    };

    const renderAction = (user: SearchUser) => {
        const status = statuses[user.id];

        if (status === 'accepted') {
            return (
                <span className="flex shrink-0 items-center gap-1 rounded-lg bg-[#E6F6F4] px-2.5 py-1 text-[11px] font-bold text-[#2DAB94]">
                    <Users className="size-3" />
                    Connected
                </span>
            );
        }

        if (status === 'sent_pending') {
            return (
                <button
                    onClick={(e) => handleCancel(e, user.id)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                    <Clock className="size-3" />
                    Pending
                </button>
            );
        }

        if (status === 'received_pending') {
            return (
                <button
                    onClick={(e) => handleAccept(e, user.id)}
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-[#2DAB94] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#248d7a]"
                >
                    <UserCheck className="size-3" />
                    Accept
                </button>
            );
        }

        return (
            <button
                onClick={(e) => handleConnect(e, user.id)}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-[#2DAB94] px-2.5 py-1 text-[11px] font-bold text-[#2DAB94] hover:bg-[#E6F6F4]"
            >
                <UserPlus className="size-3" />
                Connect
            </button>
        );
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <div className={`relative transition-all duration-200 ${focused ? 'scale-[1.01]' : ''}`}>
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        setFocused(true);
                        if (results.length > 0) setOpen(true);
                    }}
                    onBlur={() => setFocused(false)}
                    placeholder="Search founders, startups, ideas, advisors..."
                    className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-11 pr-10 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
                />
                {loading && (
                    <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
                )}
            </div>

            {open && results.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        People
                    </p>
                    {results.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => goToProfile(user.id)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                        >
                            <Avatar className="size-10 shrink-0">
                                <AvatarImage src={user.profile_photo_url} />
                                <AvatarFallback className="bg-[#E6F6F4] text-xs font-bold text-[#2DAB94]">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
                                {(user.role || user.tagline) && (
                                    <p className="truncate text-[11px] text-slate-400">
                                        {user.role && (
                                            <span className="font-medium text-[#2DAB94]">{user.role}</span>
                                        )}
                                        {user.role && user.tagline && ' · '}
                                        {user.tagline}
                                    </p>
                                )}
                            </div>
                            {renderAction(user)}
                        </button>
                    ))}
                </div>
            )}

            {open && results.length === 0 && !loading && debouncedQuery.length >= 2 && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl border border-slate-100 bg-white px-4 py-6 text-center shadow-xl">
                    <p className="text-sm text-slate-400">No users found for "{debouncedQuery}"</p>
                </div>
            )}
        </div>
    );
}
