import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { csrfToken } from '@/lib/utils';

type Props = {
    userId: number;
    userName: string;
    userPhoto: string;
    className?: string;
};

export function MessageButton({ userId, userName, userPhoto, className = '' }: Props) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/chat/conversations/${userId}`, {
            method: 'POST',
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        });

        if (res.ok) {
            const data = await res.json();
            window.dispatchEvent(
                new CustomEvent('open-chat-user', {
                    detail: {
                        id: data.conversation_id,
                        otherUser: { id: userId, name: userName, profile_photo_url: userPhoto },
                    },
                }),
            );
        }

        setLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-[#2DAB94] hover:text-[#2DAB94] disabled:opacity-60 ${className}`}
        >
            {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
            ) : (
                <MessageSquare className="h-4 w-4" />
            )}
            Message
        </button>
    );
}
