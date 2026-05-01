import React from 'react';

function timeAgo(iso: string): string {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

export type ChatUser = {
    id: number;
    name: string;
    profile_photo_url: string;
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

type Props = {
    conversations: ConversationSummary[];
    loading: boolean;
    onSelect: (conv: ConversationSummary) => void;
};

export function ConversationList({ conversations, loading, onSelect }: Props) {
    if (loading) {
        return (
            <div className="flex flex-col gap-2 p-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex animate-pulse items-center gap-3 rounded-lg p-2">
                        <div className="size-10 shrink-0 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-24 rounded bg-gray-200" />
                            <div className="h-3 w-40 rounded bg-gray-200" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <svg className="size-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
                <p className="text-sm text-gray-500">No conversations yet</p>
                <p className="text-xs text-gray-400">Connect with founders to start chatting</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-y-auto">
            {conversations.map((conv) => (
                <button
                    key={conv.id}
                    onClick={() => onSelect(conv)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                    <div className="relative shrink-0">
                        <img
                            src={conv.other_user?.profile_photo_url}
                            alt={conv.other_user?.name ?? 'User'}
                            className="size-10 rounded-full object-cover"
                        />
                        {conv.unread_count > 0 && (
                            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white">
                                {conv.unread_count > 9 ? '9+' : conv.unread_count}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                            <p className={`truncate text-sm ${conv.unread_count > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                                {conv.other_user?.name ?? 'Unknown'}
                            </p>
                            {conv.latest_message && (
                                <span className="ml-2 shrink-0 text-[11px] text-gray-400">
                                    {timeAgo(conv.latest_message.created_at)}
                                </span>
                            )}
                        </div>
                        {conv.latest_message && (
                            <p className={`truncate text-xs ${conv.unread_count > 0 ? 'font-medium text-gray-700' : 'text-gray-500'}`}>
                                {conv.latest_message.is_mine ? 'You: ' : ''}
                                {conv.latest_message.body}
                            </p>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
