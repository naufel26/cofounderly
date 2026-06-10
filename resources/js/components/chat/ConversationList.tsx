import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type ChatUser = {
    id: number;
    name: string;
    profile_photo_url: string;
    is_online?: boolean;
};

export type ConversationSummary = {
    id: number;
    other_user: ChatUser | null;
    latest_message: {
        body: string;
        created_at: string;
        is_mine: boolean;
    } | null;
    unread_count: number;
};

function timeAgo(iso: string): string {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    const days = Math.floor(diff / 86400);
    if (days < 7) return `${days}d`;
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type Props = {
    conversations: ConversationSummary[];
    loading: boolean;
    activeId?: number | null;
    onSelect: (conv: ConversationSummary) => void;
    showSearch?: boolean;
};

export function ConversationList({ conversations, loading, activeId, onSelect, showSearch = false }: Props) {
    const [query, setQuery] = useState('');

    const filtered = query.trim()
        ? conversations.filter(
              (c) =>
                  c.other_user?.name.toLowerCase().includes(query.toLowerCase()) ||
                  c.latest_message?.body.toLowerCase().includes(query.toLowerCase()),
          )
        : conversations;

    if (loading) {
        return (
            <div className="flex flex-col gap-1 p-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex animate-pulse items-center gap-3 rounded-xl p-3">
                        <div className="size-11 shrink-0 rounded-full bg-slate-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-28 rounded bg-slate-200" />
                            <div className="h-2.5 w-40 rounded bg-slate-200" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {showSearch && (
                <div className="px-3 pb-2 pt-1">
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                        <Search className="size-3.5 shrink-0 text-slate-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search messages…"
                            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>
            )}

            {filtered.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
                    <div className="rounded-full bg-slate-100 p-4">
                        <Search className="size-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                        {query ? 'No conversations found' : 'No conversations yet'}
                    </p>
                    <p className="text-xs text-slate-400">
                        {query ? 'Try a different search' : 'Connect with founders to start chatting'}
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {filtered.map((conv) => {
                        const isActive = conv.id === activeId;
                        return (
                            <button
                                key={conv.id}
                                onClick={() => onSelect(conv)}
                                className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${
                                    isActive ? 'bg-[#E6F6F4]' : 'hover:bg-slate-50'
                                }`}
                            >
                                <div className="relative shrink-0">
                                    <Avatar className="size-11">
                                        <AvatarImage src={conv.other_user?.profile_photo_url} />
                                        <AvatarFallback className="bg-[#E6F6F4] font-semibold text-[#2DAB94]">
                                            {conv.other_user?.name?.substring(0, 2).toUpperCase() ?? '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    {conv.other_user?.is_online && (
                                        <span className="absolute right-0 bottom-0 block size-3 rounded-full border-2 border-white bg-green-500" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                        <p
                                            className={`truncate text-sm ${conv.unread_count > 0 ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}
                                        >
                                            {conv.other_user?.name ?? 'Unknown'}
                                        </p>
                                        <span className="shrink-0 text-[11px] text-slate-400">
                                            {conv.latest_message ? timeAgo(conv.latest_message.created_at) : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-1">
                                        <p
                                            className={`truncate text-xs ${conv.unread_count > 0 ? 'font-medium text-slate-700' : 'text-slate-400'}`}
                                        >
                                            {conv.latest_message
                                                ? `${conv.latest_message.is_mine ? 'You: ' : ''}${conv.latest_message.body}`
                                                : 'Start the conversation'}
                                        </p>
                                        {conv.unread_count > 0 && (
                                            <span className="ml-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2DAB94] text-[10px] font-bold text-white">
                                                {conv.unread_count > 9 ? '9+' : conv.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
