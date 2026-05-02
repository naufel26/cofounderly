import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export type StatusItem = {
    id: number;
    content: string | null;
    media_url: string | null;
    expires_at: string;
    created_at: string;
    user: { id: number; name: string; profile_photo_url: string };
    is_own: boolean;
};

type Props = {
    statuses: StatusItem[];
    startIndex: number;
    onClose: () => void;
    onViewed: (id: number) => void;
    extraActions?: React.ReactNode;
};

function timeAgo(iso: string): string {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

const DURATION = 5000;

export function StatusViewer({ statuses, startIndex, onClose, onViewed, extraActions }: Props) {
    const [index, setIndex] = useState(startIndex);
    const [progress, setProgress] = useState(0);
    const rafRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const pausedRef = useRef(false);
    const pauseOffsetRef = useRef(0);

    const current = statuses[index];

    const goNext = useCallback(() => {
        if (index < statuses.length - 1) {
            setIndex((i) => i + 1);
        } else {
            onClose();
        }
    }, [index, statuses.length, onClose]);

    const goPrev = () => {
        if (index > 0) setIndex((i) => i - 1);
    };

    useEffect(() => {
        if (!current) return;
        onViewed(current.id);
        setProgress(0);
        pausedRef.current = false;
        pauseOffsetRef.current = 0;
        startTimeRef.current = Date.now();

        const tick = () => {
            if (pausedRef.current) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }
            const elapsed = Date.now() - startTimeRef.current - pauseOffsetRef.current;
            const pct = Math.min((elapsed / DURATION) * 100, 100);
            setProgress(pct);
            if (pct < 100) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                goNext();
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [index, current?.id]);

    const handlePointerDown = () => {
        pausedRef.current = true;
        pauseOffsetRef.current -= Date.now();
    };

    const handlePointerUp = () => {
        pauseOffsetRef.current += Date.now();
        pausedRef.current = false;
    };

    if (!current) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95">
            {/* Close on backdrop click */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative mx-auto flex h-full w-full max-w-sm flex-col sm:h-[85vh] sm:overflow-hidden sm:rounded-2xl">
                {/* Progress strips */}
                <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3">
                    {statuses.map((s, i) => (
                        <div key={s.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                            <div
                                className="h-full rounded-full bg-white"
                                style={{
                                    width: i < index ? '100%' : i === index ? `${progress}%` : '0%',
                                    transition: i === index ? 'none' : undefined,
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* User info bar */}
                <div className="absolute top-6 left-0 right-0 z-20 flex items-center gap-2.5 px-4 pt-2">
                    <img
                        src={current.user.profile_photo_url}
                        alt={current.user.name}
                        className="size-9 rounded-full border-2 border-white object-cover"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-white drop-shadow">{current.user.name}</p>
                        <p className="text-[11px] text-white/70">{timeAgo(current.created_at)}</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Content area */}
                <div
                    className="flex h-full items-center justify-center"
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    {current.media_url ? (
                        <img
                            src={current.media_url}
                            alt="Status"
                            className="h-full w-full object-cover sm:rounded-2xl"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2DAB94] via-teal-600 to-slate-800 sm:rounded-2xl">
                            <p className="max-w-xs px-8 text-center text-2xl font-bold leading-snug text-white drop-shadow-md">
                                {current.content}
                            </p>
                        </div>
                    )}
                </div>

                {/* Extra actions (e.g. Delete Status on own profile) */}
                {extraActions && (
                    <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center px-4" onClick={(e) => e.stopPropagation()}>
                        {extraActions}
                    </div>
                )}

                {/* Left / Right tap zones */}
                <div className="absolute inset-0 z-10 flex" style={{ top: '80px', bottom: extraActions ? '60px' : '0' }}>
                    <div className="h-full w-1/3 cursor-pointer" onClick={(e) => { e.stopPropagation(); goPrev(); }} />
                    <div className="h-full flex-1" />
                    <div className="h-full w-1/3 cursor-pointer" onClick={(e) => { e.stopPropagation(); goNext(); }} />
                </div>
            </div>
        </div>
    );
}
