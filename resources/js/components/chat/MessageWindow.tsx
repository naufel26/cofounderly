import React, { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { csrfToken } from '@/lib/utils';
import { type ChatUser } from './ConversationList';

export type ChatMessage = {
    id: number;
    body: string;
    sender_id: number;
    created_at: string;
    sender: ChatUser;
};

type Props = {
    conversationId: number;
    otherUser: ChatUser;
    onBack: () => void;
    onClose: () => void;
};

export function MessageWindow({ conversationId, otherUser, onBack, onClose }: Props) {
    const { auth } = usePage().props as any;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    };

    useEffect(() => {
        setLoading(true);
        fetch(`/chat/conversations/${conversationId}/messages`, {
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        })
            .then((r) => r.json())
            .then((data) => {
                setMessages(data);
                setLoading(false);
                scrollToBottom();
            });

        const channel = window.Echo.private(`conversation.${conversationId}`).listen(
            '.MessageSent',
            (data: ChatMessage) => {
                setMessages((prev) => [...prev, data]);
                scrollToBottom();
            },
        );

        return () => {
            channel.stopListening('.MessageSent');
            window.Echo.leave(`conversation.${conversationId}`);
        };
    }, [conversationId]);

    const handleSend = async () => {
        const body = text.trim();
        if (!body || sending) return;

        setSending(true);
        setText('');

        const res = await fetch(`/chat/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': csrfToken(),
                'X-Socket-ID': window.Echo.socketId(),
            },
            body: JSON.stringify({ body }),
        });

        if (res.ok) {
            const msg: ChatMessage = await res.json();
            setMessages((prev) => [...prev, msg]);
            scrollToBottom();
        }

        setSending(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 px-3 py-2.5">
                <button onClick={onBack} className="rounded-full p-1 text-gray-500 hover:bg-gray-100">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <img src={otherUser.profile_photo_url} alt={otherUser.name} className="size-8 rounded-full object-cover" />
                <span className="flex-1 truncate text-sm font-semibold text-gray-900">{otherUser.name}</span>
                <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="chat-scroll flex-1 space-y-3 overflow-y-auto p-3">
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
                                <div className="h-8 w-40 animate-pulse rounded-2xl bg-gray-200" />
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-sm text-gray-500">No messages yet</p>
                        <p className="text-xs text-gray-400">Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.sender_id === auth?.user?.id;
                        return (
                            <div key={msg.id} className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                                {!isMine && (
                                    <img
                                        src={msg.sender.profile_photo_url}
                                        alt={msg.sender.name}
                                        className="size-6 shrink-0 rounded-full object-cover"
                                    />
                                )}
                                <div
                                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                                        isMine
                                            ? 'rounded-br-sm bg-teal-500 text-white'
                                            : 'rounded-bl-sm bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    {msg.body}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 p-2.5">
                <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-1.5">
                    <textarea
                        rows={1}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a message…"
                        className="max-h-20 flex-1 resize-none bg-transparent py-1 text-sm outline-none placeholder:text-gray-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!text.trim() || sending}
                        className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white transition-colors hover:bg-teal-600 disabled:opacity-40"
                    >
                        <svg className="size-3.5 translate-x-px" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
