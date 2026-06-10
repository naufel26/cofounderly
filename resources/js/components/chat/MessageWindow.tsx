import React, { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCheck, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { csrfToken } from '@/lib/utils';
import { type ChatUser } from './ConversationList';

export type ChatMessage = {
    id: number;
    body: string;
    sender_id: number;
    created_at: string;
    read_at: string | null;
    sender: ChatUser;
};

type Props = {
    conversationId: number;
    otherUser: ChatUser;
    onBack: () => void;
    onClose?: () => void;
    fullPage?: boolean;
};

function formatDateLabel(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function isSameDay(a: string, b: string): boolean {
    return new Date(a).toDateString() === new Date(b).toDateString();
}

export function MessageWindow({ conversationId, otherUser, onBack, onClose, fullPage = false }: Props) {
    const { auth } = usePage().props as any;
    const myId: number = auth?.user?.id;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [otherLastReadAt, setOtherLastReadAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = (smooth = true) => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' }), 50);
    };

    useEffect(() => {
        setLoading(true);
        setMessages([]);
        fetch(`/chat/conversations/${conversationId}/messages`, {
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        })
            .then((r) => r.json())
            .then((data) => {
                setMessages(data.messages ?? []);
                setOtherLastReadAt(data.other_last_read_at ?? null);
                setLoading(false);
                scrollToBottom(false);
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
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

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

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    // Find the last message I sent that the other user has read
    const lastSeenMsgId = (() => {
        if (!otherLastReadAt) return null;
        const readTime = new Date(otherLastReadAt).getTime();
        let result: number | null = null;
        for (const msg of messages) {
            if (msg.sender_id === myId && new Date(msg.created_at).getTime() <= readTime) {
                result = msg.id;
            }
        }
        return result;
    })();

    const headerClass = fullPage
        ? 'flex items-center gap-3 border-b border-slate-100 px-5 py-4'
        : 'flex items-center gap-3 border-b border-slate-100 px-3 py-2.5';

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <div className={headerClass}>
                {!fullPage && (
                    <button onClick={onBack} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <div className="relative shrink-0">
                    <Avatar className={fullPage ? 'size-10' : 'size-9'}>
                        <AvatarImage src={otherUser.profile_photo_url} />
                        <AvatarFallback className="bg-[#E6F6F4] font-semibold text-[#2DAB94]">
                            {otherUser.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {otherUser.is_online && (
                        <span className="absolute right-0 bottom-0 block size-2.5 rounded-full border-2 border-white bg-green-500" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`truncate font-semibold text-slate-900 ${fullPage ? 'text-base' : 'text-sm'}`}>
                        {otherUser.name}
                    </p>
                    {otherUser.is_online && (
                        <p className="text-xs text-green-500 font-medium">Active now</p>
                    )}
                </div>
                {onClose && (
                    <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {loading ? (
                    <div className="flex flex-col gap-3 pt-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'items-end gap-2'}`}>
                                {i % 2 !== 0 && <div className="size-7 shrink-0 rounded-full bg-slate-200 animate-pulse" />}
                                <div
                                    className={`animate-pulse rounded-2xl ${i % 2 === 0 ? 'bg-[#2DAB94]/20' : 'bg-slate-200'}`}
                                    style={{ height: 36, width: [120, 180, 90, 150][i - 1] }}
                                />
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
                        <Avatar className="size-16 ring-4 ring-[#E6F6F4]">
                            <AvatarImage src={otherUser.profile_photo_url} />
                            <AvatarFallback className="bg-[#E6F6F4] text-xl font-bold text-[#2DAB94]">
                                {otherUser.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-slate-800">{otherUser.name}</p>
                            <p className="text-sm text-slate-400 mt-1">Say hello to start the conversation</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => {
                            const isMine = msg.sender_id === myId;
                            const prevMsg = idx > 0 ? messages[idx - 1] : null;
                            const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;

                            const showDateSep = !prevMsg || !isSameDay(prevMsg.created_at, msg.created_at);
                            const isGroupStart = !prevMsg || prevMsg.sender_id !== msg.sender_id || showDateSep;
                            const isGroupEnd = !nextMsg || nextMsg.sender_id !== msg.sender_id || !isSameDay(msg.created_at, nextMsg.created_at);

                            const showReadReceipt = isMine && isGroupEnd && msg.id === lastSeenMsgId;

                            return (
                                <React.Fragment key={msg.id}>
                                    {showDateSep && (
                                        <div className="flex items-center gap-3 py-3">
                                            <div className="h-px flex-1 bg-slate-100" />
                                            <span className="text-[11px] font-medium text-slate-400 px-2">
                                                {formatDateLabel(msg.created_at)}
                                            </span>
                                            <div className="h-px flex-1 bg-slate-100" />
                                        </div>
                                    )}

                                    <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : ''} ${isGroupStart ? 'mt-3' : 'mt-0.5'}`}>
                                        {/* Avatar — only show for other user on last msg of group */}
                                        {!isMine && (
                                            <div className="size-7 shrink-0">
                                                {isGroupEnd ? (
                                                    <Avatar className="size-7">
                                                        <AvatarImage src={msg.sender.profile_photo_url} />
                                                        <AvatarFallback className="bg-[#E6F6F4] text-[10px] font-bold text-[#2DAB94]">
                                                            {msg.sender.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ) : null}
                                            </div>
                                        )}

                                        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[72%]`}>
                                            <div
                                                className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                                                    isMine
                                                        ? `bg-[#2DAB94] text-white ${isGroupStart ? 'rounded-2xl rounded-br-md' : isGroupEnd ? 'rounded-2xl rounded-tr-md' : 'rounded-lg rounded-r-md'}`
                                                        : `bg-slate-100 text-slate-900 ${isGroupStart ? 'rounded-2xl rounded-bl-md' : isGroupEnd ? 'rounded-2xl rounded-tl-md' : 'rounded-lg rounded-l-md'}`
                                                }`}
                                            >
                                                {msg.body}
                                            </div>
                                            {isGroupEnd && (
                                                <span className="mt-1 text-[10px] text-slate-400 px-1">
                                                    {formatTime(msg.created_at)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {showReadReceipt && (
                                        <div className="flex justify-end items-center gap-1 pr-1 -mt-0.5">
                                            <CheckCheck className="size-3.5 text-[#2DAB94]" />
                                            <span className="text-[10px] text-[#2DAB94] font-medium">Seen</span>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        <div ref={bottomRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className={`border-t border-slate-100 ${fullPage ? 'px-5 py-4' : 'px-3 py-2.5'}`}>
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 focus-within:border-[#2DAB94] focus-within:bg-white transition-colors">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={text}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a message…"
                        className="max-h-[120px] flex-1 resize-none bg-transparent py-0.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        style={{ height: 'auto' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!text.trim() || sending}
                        className="mb-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#2DAB94] text-white transition-colors hover:bg-[#248d7a] disabled:opacity-40"
                    >
                        <Send className="size-3.5" />
                    </button>
                </div>
                <p className="mt-1.5 text-center text-[10px] text-slate-300">Enter to send · Shift+Enter for new line</p>
            </div>
        </div>
    );
}
