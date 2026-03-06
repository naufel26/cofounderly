import { Image, Link2, Type, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

export const CreatePost = () => {
    const [content, setContent] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handlePost = () => {
        if (!content.trim()) {
            toast.error('Please write something before posting');
            return;
        }
        toast.success('Post published successfully!');
        setContent('');
        setIsFocused(false);
    };

    return (
        <div
            className={`card-elevated p-4 transition-all duration-200 ${isFocused ? 'ring-2 ring-primary/20' : ''}`}
        >
            <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        JD
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <Textarea
                        placeholder="Share your startup idea, update, or ask for help…"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => !content && setIsFocused(false)}
                        className={`bg-muted/50 min-h-[60px] resize-none rounded-lg border-0 p-3 transition-all focus:bg-background focus:ring-0 ${isFocused ? 'min-h-[100px]' : ''}`}
                    />

                    {/* Action Bar */}
                    <div
                        className={`mt-3 flex items-center justify-between transition-all duration-200 ${isFocused ? 'opacity-100' : 'opacity-70'}`}
                    >
                        <div className="flex items-center gap-1">
                            <button className="text-muted-foreground rounded-lg p-2 transition-colors hover:bg-secondary hover:text-foreground">
                                <Type className="h-4 w-4" />
                            </button>
                            <button className="text-muted-foreground rounded-lg p-2 transition-colors hover:bg-secondary hover:text-foreground">
                                <Link2 className="h-4 w-4" />
                            </button>
                            <button className="text-muted-foreground rounded-lg p-2 transition-colors hover:bg-secondary hover:text-foreground">
                                <Image className="h-4 w-4" />
                            </button>
                        </div>

                        <button
                            onClick={handlePost}
                            disabled={!content.trim()}
                            className="btn-gradient-primary flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Send className="h-4 w-4" />
                            <span>Post</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
