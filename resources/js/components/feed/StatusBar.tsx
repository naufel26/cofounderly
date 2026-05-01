import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { csrfToken } from '@/lib/utils';
import { CreateStatusModal } from './CreateStatusModal';
import { StatusViewer, type StatusItem } from './StatusViewer';

function getViewed(): Set<number> {
    try {
        return new Set(JSON.parse(localStorage.getItem('viewed_statuses') ?? '[]'));
    } catch {
        return new Set();
    }
}

function markViewed(id: number) {
    const s = getViewed();
    s.add(id);
    localStorage.setItem('viewed_statuses', JSON.stringify([...s]));
}

export function StatusBar() {
    const { auth } = usePage().props as any;
    const [statuses, setStatuses] = useState<StatusItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [viewed, setViewed] = useState<Set<number>>(getViewed);

    useEffect(() => {
        fetch('/statuses', {
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        })
            .then((r) => r.json())
            .then((data: StatusItem[]) => {
                setStatuses(data);
                setLoading(false);
            });
    }, []);

    const ownStatus = statuses.find((s) => s.is_own) ?? null;
    const others = statuses.filter((s) => !s.is_own);

    // Put own status first if it exists, then others
    const orderedStatuses = [...(ownStatus ? [ownStatus] : []), ...others];

    const openViewer = (status: StatusItem) => {
        const idx = orderedStatuses.indexOf(status);
        setViewerIndex(idx);
    };

    const handleViewed = (id: number) => {
        markViewed(id);
        setViewed((prev) => new Set([...prev, id]));
    };

    const handleCreated = (status: StatusItem) => {
        setStatuses((prev) => [status, ...prev.filter((s) => !s.is_own)]);
    };

    const handleOwnClick = () => {
        if (ownStatus) {
            openViewer(ownStatus);
        } else {
            setCreateOpen(true);
        }
    };

    if (loading) {
        return (
            <div className="card-elevated flex gap-4 overflow-x-auto p-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex shrink-0 flex-col items-center gap-2">
                        <div className="size-14 animate-pulse rounded-full bg-slate-200" />
                        <div className="h-2.5 w-10 animate-pulse rounded bg-slate-200" />
                    </div>
                ))}
            </div>
        );
    }

    if (!ownStatus && others.length === 0) return null;

    return (
        <>
            <div className="card-elevated p-4">
                <div className="custom-scrollbar flex gap-4 overflow-x-auto pb-1">
                    {/* Your Status bubble */}
                    <button
                        onClick={handleOwnClick}
                        className="flex shrink-0 flex-col items-center gap-1.5"
                    >
                        <div
                            className={`p-[2.5px] rounded-full ${
                                ownStatus
                                    ? 'bg-gradient-to-tr from-[#2DAB94] to-teal-300'
                                    : 'bg-slate-200'
                            }`}
                        >
                            <div className="rounded-full bg-white p-[2px]">
                                <div className="relative">
                                    <img
                                        src={auth?.user?.profile_photo_url}
                                        alt="Your status"
                                        className="size-12 rounded-full object-cover"
                                    />
                                    {!ownStatus && (
                                        <span className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full bg-[#2DAB94] ring-2 ring-white">
                                            <Plus className="size-3 text-white" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="w-14 truncate text-center text-[10px] font-medium text-slate-600">
                            {ownStatus ? 'Your Status' : 'Add Status'}
                        </span>
                    </button>

                    {/* Other users' statuses */}
                    {others.map((status) => {
                        const isViewed = viewed.has(status.id);
                        return (
                            <button
                                key={status.id}
                                onClick={() => openViewer(status)}
                                className="flex shrink-0 flex-col items-center gap-1.5"
                            >
                                <div
                                    className={`p-[2.5px] rounded-full ${
                                        isViewed
                                            ? 'bg-slate-300'
                                            : 'bg-gradient-to-tr from-[#2DAB94] via-teal-400 to-[#F1B981]'
                                    }`}
                                >
                                    <div className="rounded-full bg-white p-[2px]">
                                        <img
                                            src={status.user.profile_photo_url}
                                            alt={status.user.name}
                                            className="size-12 rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                                <span className="w-14 truncate text-center text-[10px] font-medium text-slate-600">
                                    {status.user.name.split(' ')[0]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {viewerIndex !== null && (
                <StatusViewer
                    statuses={orderedStatuses}
                    startIndex={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                    onViewed={handleViewed}
                />
            )}

            {createOpen && (
                <CreateStatusModal
                    onClose={() => setCreateOpen(false)}
                    onCreated={handleCreated}
                />
            )}
        </>
    );
}
