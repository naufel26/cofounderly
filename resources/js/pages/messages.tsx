import { Head, router, usePage } from '@inertiajs/react';
import { Edit, MessageSquare } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ChatOverlay } from '@/components/chat/ChatOverlay';
import { type ConversationSummary } from '@/components/chat/ConversationList';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageWindow } from '@/components/chat/MessageWindow';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { csrfToken } from '@/lib/utils';

type Props = {
    initialConversationId: number | null;
};

export default function Messages({ initialConversationId }: Props) {
    const { auth } = usePage().props as any;
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [activeId, setActiveId] = useState<number | null>(initialConversationId);
    const [activeUser, setActiveUser] = useState<ConversationSummary['other_user'] | null>(null);

    const loadConversations = useCallback(async () => {
        setLoadingConvs(true);
        const res = await fetch('/chat/conversations', {
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        });
        if (res.ok) {
            const data: ConversationSummary[] = await res.json();
            setConversations(data);

            const total = data.reduce((acc, c) => acc + c.unread_count, 0);
            window.dispatchEvent(new CustomEvent('chat-unread-updated', { detail: total }));

            // If initial conversation ID given, find its user
            if (initialConversationId && !activeUser) {
                const found = data.find((c) => c.id === initialConversationId);
                if (found?.other_user) setActiveUser(found.other_user);
            }
        }
        setLoadingConvs(false);
    }, [initialConversationId]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    // Listen for open-chat-user events (from Message buttons on other pages)
    useEffect(() => {
        const handler = (e: CustomEvent<{ id: number; otherUser: ConversationSummary['other_user'] }>) => {
            setActiveId(e.detail.id);
            setActiveUser(e.detail.otherUser);
            router.visit(`/messages?c=${e.detail.id}`, { replace: true, preserveState: true });
        };
        window.addEventListener('open-chat-user', handler as EventListener);
        return () => window.removeEventListener('open-chat-user', handler as EventListener);
    }, []);

    const handleSelectConversation = (conv: ConversationSummary) => {
        if (!conv.other_user) return;
        setActiveId(conv.id);
        setActiveUser(conv.other_user);
        setConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, unread_count: 0 } : c)));
        router.visit(`/messages?c=${conv.id}`, { replace: true, preserveState: true });
    };

    const handleBack = () => {
        setActiveId(null);
        setActiveUser(null);
        router.visit('/messages', { replace: true, preserveState: true });
        loadConversations();
    };

    const totalUnread = conversations.reduce((acc, c) => acc + c.unread_count, 0);

    return (
        <>
            <div className="flex h-screen flex-col bg-slate-50">
                <Head title="Messages | Cofounderly" />
                <TopNavigation />

                <div className="flex flex-1 overflow-hidden pt-16">
                    <div className="mx-auto flex w-full max-w-5xl gap-0 overflow-hidden rounded-none bg-white shadow-sm lg:my-4 lg:gap-0 lg:rounded-2xl lg:ring-1 lg:ring-slate-100">
                        {/* Left: Conversation list */}
                        <div
                            className={`flex w-full flex-col border-r border-slate-100 lg:w-80 lg:shrink-0 ${activeId ? 'hidden lg:flex' : 'flex'}`}
                        >
                            {/* Panel header */}
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                                <div>
                                    <h1 className="text-lg font-extrabold text-slate-900">Messaging</h1>
                                    {totalUnread > 0 && (
                                        <p className="text-xs text-[#2DAB94] font-medium">{totalUnread} unread</p>
                                    )}
                                </div>
                                <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                                    <Edit className="size-4" />
                                </button>
                            </div>

                            {/* Search + list */}
                            <div className="flex-1 overflow-hidden">
                                <ConversationList
                                    conversations={conversations}
                                    loading={loadingConvs}
                                    activeId={activeId}
                                    onSelect={handleSelectConversation}
                                    showSearch
                                />
                            </div>
                        </div>

                        {/* Right: Active conversation or empty state */}
                        <div className={`flex-1 ${activeId ? 'flex' : 'hidden lg:flex'} flex-col`}>
                            {activeId && activeUser ? (
                                <MessageWindow
                                    key={activeId}
                                    conversationId={activeId}
                                    otherUser={activeUser}
                                    onBack={handleBack}
                                    fullPage
                                />
                            ) : (
                                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
                                    <div className="rounded-3xl bg-slate-100 p-6">
                                        <MessageSquare className="size-12 text-slate-300" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-slate-700">Your messages</p>
                                        <p className="mt-1 max-w-xs text-sm text-slate-400">
                                            Select a conversation from the left to start chatting, or connect with a founder to begin.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => router.visit('/connections')}
                                        className="rounded-xl bg-[#2DAB94] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#248d7a]"
                                    >
                                        Browse connections
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ChatOverlay hideOnMessagesPage />
        </>
    );
}
