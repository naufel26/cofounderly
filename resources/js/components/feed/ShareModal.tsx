import { Check, Copy, Facebook, Link2, Twitter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = {
    postId: number;
    postUrl: string;
    postContent?: string | null;
    onClose: () => void;
};

type Option = {
    label: string;
    icon: React.ReactNode;
    action: () => void;
    color: string;
};

// LinkedIn icon (not in lucide)
function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-5 fill-current">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

// WhatsApp icon
function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

export function ShareModal({ postId, postUrl, postContent, onClose }: Props) {
    const [copied, setCopied] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const excerpt = postContent ? postContent.slice(0, 100) + (postContent.length > 100 ? '…' : '') : 'Check out this post on Cofounderly';
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedText = encodeURIComponent(excerpt);

    const copyLink = async () => {
        await navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const open = (url: string) => window.open(url, '_blank', 'noopener,width=600,height=500');

    const options: Option[] = [
        {
            label: 'Copy Link',
            icon: copied ? <Check className="size-5" /> : <Copy className="size-5" />,
            action: copyLink,
            color: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        },
        {
            label: 'Facebook',
            icon: <Facebook className="size-5" />,
            action: () => open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`),
            color: 'bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20',
        },
        {
            label: 'LinkedIn',
            icon: <LinkedInIcon />,
            action: () => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`),
            color: 'bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20',
        },
        {
            label: 'Twitter / X',
            icon: <Twitter className="size-5" />,
            action: () => open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`),
            color: 'bg-slate-900/10 text-slate-900 hover:bg-slate-900/20',
        },
        {
            label: 'WhatsApp',
            icon: <WhatsAppIcon />,
            action: () => open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`),
            color: 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20',
        },
    ];

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Share Post</p>
            </div>

            {/* Copy link row — prominent */}
            <button
                onClick={copyLink}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
            >
                <span className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    {copied ? <Check className="size-4 text-[#2DAB94]" /> : <Link2 className="size-4" />}
                </span>
                <div>
                    <p className="text-sm font-bold text-slate-800">{copied ? 'Copied!' : 'Copy Link'}</p>
                    <p className="truncate text-[11px] text-slate-400">{postUrl}</p>
                </div>
            </button>

            <div className="border-t border-slate-100 px-4 py-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Share to</p>
                <div className="grid grid-cols-4 gap-2">
                    {options.slice(1).map((opt) => (
                        <button
                            key={opt.label}
                            onClick={opt.action}
                            className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors ${opt.color}`}
                            title={opt.label}
                        >
                            {opt.icon}
                            <span className="text-[10px] font-bold">{opt.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
