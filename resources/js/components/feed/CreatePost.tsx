import { useForm } from '@inertiajs/react';
import { Image, Link2, Send, Type, X, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner'; // Assuming you use sonner for toasts
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export const CreatePost = ({ user }: { user: any }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            content: '',
            media: [] as File[],
            type: 'text',
        });

    // Cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);

            // Append new files to existing ones
            const newMedia = [...data.media, ...filesArray];
            setData('media', newMedia);
            setData('type', 'media'); // Update type for the backend

            // Generate preview URLs
            const newPreviews = filesArray.map((file) =>
                URL.createObjectURL(file),
            );
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
        // Reset input so the same file can be selected again if removed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (indexToRemove: number) => {
        const updatedMedia = data.media.filter(
            (_, index) => index !== indexToRemove,
        );
        const updatedPreviews = previews.filter(
            (_, index) => index !== indexToRemove,
        );

        setData('media', updatedMedia);
        setPreviews(updatedPreviews);

        if (updatedMedia.length === 0) {
            setData('type', 'text');
        }
    };

    const handleAddLink = () => {
        if (linkUrl) {
            setData(
                'content',
                data.content ? `${data.content}\n${linkUrl}` : linkUrl,
            );
            setLinkUrl('');
            setShowLinkInput(false);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/posts', {
            forceFormData: true, // Crucial for sending the files array
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPreviews([]);
                setShowLinkInput(false);
                toast.success('Post published successfully!');
            },
            onError: () => {
                toast.error('Failed to publish post. Please check the errors.');
            },
        });
    };

    return (
        <form onSubmit={submit} className="card-elevated p-4">
            <div className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={user?.profile_photo_url} />
                    <AvatarFallback className="bg-slate-200 text-slate-600">
                        {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    {/* Text Area */}
                    <div className="min-h-[80px] rounded-2xl bg-slate-50/80 p-4 transition-colors focus-within:bg-slate-100/80">
                        <textarea
                            value={data.content}
                            onChange={(e) => {
                                setData('content', e.target.value);
                                clearErrors('content');
                            }}
                            placeholder="Share your startup idea, update, or ask for help..."
                            className="w-full resize-none border-none bg-transparent p-0 text-[15px] leading-relaxed placeholder:text-slate-400 focus:ring-0"
                            rows={3}
                        />
                        {errors.content && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    {/* Image Previews Container */}
                    {previews.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {previews.map((preview, index) => (
                                <div
                                    key={index}
                                    className="group relative h-24 w-24 rounded-xl border border-slate-200 bg-slate-50"
                                >
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-full w-full rounded-xl object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.media && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.media}
                        </p>
                    )}

                    {/* URL Input Toggle Area */}
                    {showLinkInput && (
                        <div className="mt-3 flex gap-2">
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="Paste a URL here..."
                                className="flex-1 rounded-xl border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#2DAB94] focus:ring-[#2DAB94]"
                            />
                            <Button
                                type="button"
                                onClick={handleAddLink}
                                variant="secondary"
                                className="rounded-xl"
                            >
                                Add
                            </Button>
                        </div>
                    )}

                    {/* Toolbar & Submit */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#2DAB94]"
                                title="Format Text"
                            >
                                <Type className="h-5 w-5" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowLinkInput(!showLinkInput)}
                                className={`rounded-lg p-2 transition-colors hover:bg-slate-50 ${showLinkInput ? 'bg-teal-50 text-[#2DAB94]' : 'text-slate-400 hover:text-[#2DAB94]'}`}
                                title="Attach Link"
                            >
                                <Link2 className="h-5 w-5" />
                            </button>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#2DAB94]"
                                title="Attach Image"
                            >
                                <Image className="h-5 w-5" />
                            </button>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                (!data.content.trim() &&
                                    data.media.length === 0)
                            }
                            className="flex h-10 gap-2 rounded-xl border-none bg-[#B5E4DC] px-5 font-bold text-[#2DAB94] transition-all hover:bg-[#a2dcd2] active:scale-95 disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};
