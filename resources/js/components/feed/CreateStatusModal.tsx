import React, { useRef, useState } from 'react';
import { X, ImagePlus, Smile } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { csrfToken } from '@/lib/utils';
import { type StatusItem } from './StatusViewer';

type Props = {
    onClose: () => void;
    onCreated: (status: StatusItem) => void;
};

const GRADIENTS = [
    'from-[#2DAB94] to-teal-700',
    'from-violet-500 to-purple-700',
    'from-orange-400 to-rose-600',
    'from-sky-400 to-blue-700',
    'from-amber-400 to-orange-600',
];

export function CreateStatusModal({ onClose, onCreated }: Props) {
    const { auth } = usePage().props as any;
    const [text, setText] = useState('');
    const [gradient, setGradient] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setText('');
    };

    const handleSubmit = async () => {
        if (submitting || (!text.trim() && !image)) return;
        setSubmitting(true);

        const body = new FormData();
        if (text.trim()) body.append('content', text.trim());
        if (image) body.append('media', image);

        const res = await fetch('/statuses', {
            method: 'POST',
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken() },
            body,
        });

        if (res.ok) {
            const status: StatusItem = await res.json();
            onCreated(status);
            onClose();
        }

        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 sm:items-center">
            <div
                className="w-full max-w-sm overflow-hidden rounded-t-3xl bg-white sm:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <h3 className="font-bold text-slate-900">New Status</h3>
                    <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
                        <X className="size-5" />
                    </button>
                </div>

                {/* Preview */}
                <div className={`relative mx-5 mt-5 flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${GRADIENTS[gradient]}`}>
                    {preview ? (
                        <>
                            <img src={preview} alt="preview" className="h-full w-full object-cover" />
                            <button
                                onClick={() => { setImage(null); setPreview(null); }}
                                className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white"
                            >
                                <X className="size-3.5" />
                            </button>
                        </>
                    ) : (
                        <p className={`px-6 text-center text-lg font-bold leading-snug text-white ${!text ? 'opacity-30' : ''}`}>
                            {text || 'Your status preview…'}
                        </p>
                    )}
                </div>

                {/* Gradient picker (only when no image) */}
                {!preview && (
                    <div className="mt-3 flex justify-center gap-2 px-5">
                        {GRADIENTS.map((g, i) => (
                            <button
                                key={i}
                                onClick={() => setGradient(i)}
                                className={`h-6 w-6 rounded-full bg-gradient-to-br ${g} ${gradient === i ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                            />
                        ))}
                    </div>
                )}

                {/* Text input */}
                {!preview && (
                    <div className="px-5 pt-4">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={500}
                            rows={3}
                            placeholder="What's on your mind?"
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-400 focus:bg-white placeholder:text-slate-400"
                        />
                        <p className="mt-1 text-right text-[11px] text-slate-400">{text.length}/500</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 px-5 pb-6 pt-2">
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        <ImagePlus className="size-4" />
                        Photo
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

                    <button
                        onClick={handleSubmit}
                        disabled={submitting || (!text.trim() && !image)}
                        className="ml-auto flex items-center gap-2 rounded-xl bg-[#2DAB94] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#248d7a] disabled:opacity-50"
                    >
                        {submitting ? (
                            <div className="size-4 animate-spin rounded-full border-b-2 border-white" />
                        ) : (
                            <Smile className="size-4" />
                        )}
                        Share Status
                    </button>
                </div>
            </div>
        </div>
    );
}
