import React, { useCallback, useEffect, useState } from 'react';
import { csrfToken } from '@/lib/utils';
import { type ConversationSummary } from './ConversationList';
import { ConversationList } from './ConversationList';
import { MessageWindow } from './MessageWindow';

type ActiveConv = {
    id: number;
    otherUser: { id: number; name: string; profile_photo_url: string };
};

export function ChatOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [loadingConvs, setLoadingConvs] = useState(false);
    const [activeConv, setActiveConv] = useState<ActiveConv | null>(null);
    const [unreadTotal, setUnreadTotal] = useState(0);

    const loadConversations = useCallback(async () => {
        setLoadingConvs(true);
        const res = await fetch('/chat/conversations', {
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        });
        if (res.ok) {
            const data: ConversationSummary[] = await res.json();
            setConversations(data);
            setUnreadTotal(data.reduce((acc, c) => acc + c.unread_count, 0));
        }
        setLoadingConvs(false);
    }, []);

    // Open inbox (dispatched by nav message button)
    useEffect(() => {
        const handler = () => {
            setActiveConv(null);
            setIsOpen(true);
            loadConversations();
        };
        window.addEventListener('open-chat', handler);
        return () => window.removeEventListener('open-chat', handler);
    }, [loadConversations]);

    // Open directly into a specific conversation (dispatched by Message buttons)
    useEffect(() => {
        const handler = (e: CustomEvent<ActiveConv>) => {
            setActiveConv(e.detail);
            setIsOpen(true);
        };
        window.addEventListener('open-chat-user', handler as EventListener);
        return () => window.removeEventListener('open-chat-user', handler as EventListener);
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        if (!activeConv) loadConversations();
    };

    const handleClose = () => {
        setIsOpen(false);
        setActiveConv(null);
    };

    const handleSelectConversation = (conv: ConversationSummary) => {
        if (!conv.other_user) return;
        setActiveConv({ id: conv.id, otherUser: conv.other_user });
        setConversations((prev) =>
            prev.map((c) => (c.id === conv.id ? { ...c, unread_count: 0 } : c)),
        );
        setUnreadTotal((prev) => Math.max(0, prev - conv.unread_count));
    };

    const handleBack = () => {
        setActiveConv(null);
        loadConversations();
    };

    return (
        <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
            {isOpen && (
                <div className="flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    {activeConv ? (
                        <MessageWindow
                            conversationId={activeConv.id}
                            otherUser={activeConv.otherUser}
                            onBack={handleBack}
                            onClose={handleClose}
                        />
                    ) : (
                        <>
                            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                                <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
                                <button onClick={handleClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
                                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="chat-scroll flex-1 overflow-y-auto">
                                <ConversationList
                                    conversations={conversations}
                                    loading={loadingConvs}
                                    onSelect={handleSelectConversation}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            <button
                onClick={isOpen ? handleClose : handleOpen}
                className="relative flex size-14 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg transition-all hover:bg-teal-600 hover:shadow-xl active:scale-95"
            >
                {isOpen ? (
                    <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                )}
                {!isOpen && unreadTotal > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                        {unreadTotal > 9 ? '9+' : unreadTotal}
                    </span>
                )}
            </button>
        </div>
    );
}
