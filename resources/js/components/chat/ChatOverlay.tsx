import { router, usePage } from '@inertiajs/react';
import { MessageSquare, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { csrfToken } from '@/lib/utils';
import { type ConversationSummary } from './ConversationList';
import { ConversationList } from './ConversationList';
import { MessageWindow } from './MessageWindow';

type ActiveConv = {
    id: number;
    otherUser: ConversationSummary['other_user'];
};

type Props = {
    hideOnMessagesPage?: boolean;
};

export function ChatOverlay({ hideOnMessagesPage = false }: Props) {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [loadingConvs, setLoadingConvs] = useState(false);
    const [activeConv, setActiveConv] = useState<ActiveConv | null>(null);
    const [unreadTotal, setUnreadTotal] = useState(0);

    // Hide overlay on the full-page messages route
    if (hideOnMessagesPage && url?.startsWith('/messages')) {
        return null;
    }

    const loadConversations = useCallback(async () => {
        setLoadingConvs(true);
        const res = await fetch('/chat/conversations', {
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        });
        if (res.ok) {
            const data: ConversationSummary[] = await res.json();
            setConversations(data);
            const total = data.reduce((acc, c) => acc + c.unread_count, 0);
            setUnreadTotal(total);
            window.dispatchEvent(new CustomEvent('chat-unread-updated', { detail: total }));
        }
        setLoadingConvs(false);
    }, []);

    useEffect(() => {
        const handler = () => {
            setActiveConv(null);
            setIsOpen(true);
            loadConversations();
        };
        window.addEventListener('open-chat', handler);
        return () => window.removeEventListener('open-chat', handler);
    }, [loadConversations]);

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
        setConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, unread_count: 0 } : c)));
        setUnreadTotal((prev) => Math.max(0, prev - conv.unread_count));
    };

    const handleBack = () => {
        setActiveConv(null);
        loadConversations();
    };

    return (
        <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
            {isOpen && (
                <div className="flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
                    {activeConv ? (
                        <MessageWindow
                            key={activeConv.id}
                            conversationId={activeConv.id}
                            otherUser={activeConv.otherUser!}
                            onBack={handleBack}
                            onClose={handleClose}
                        />
                    ) : (
                        <>
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Messages</h3>
                                    {unreadTotal > 0 && (
                                        <p className="text-[11px] text-[#2DAB94] font-medium">{unreadTotal} unread</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { handleClose(); router.visit('/messages'); }}
                                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#2DAB94] transition-colors hover:bg-[#E6F6F4]"
                                    >
                                        See all
                                    </button>
                                    <button onClick={handleClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                                        <X className="size-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <ConversationList
                                    conversations={conversations}
                                    loading={loadingConvs}
                                    onSelect={handleSelectConversation}
                                    showSearch
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            <button
                onClick={isOpen ? handleClose : handleOpen}
                className="relative flex size-14 items-center justify-center rounded-full bg-[#2DAB94] text-white shadow-lg shadow-teal-200 transition-all hover:bg-[#248d7a] hover:shadow-xl active:scale-95"
            >
                {isOpen ? (
                    <X className="size-5" />
                ) : (
                    <MessageSquare className="size-5" />
                )}
                {!isOpen && unreadTotal > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white ring-2 ring-white">
                        {unreadTotal > 9 ? '9+' : unreadTotal}
                    </span>
                )}
            </button>
        </div>
    );
}
