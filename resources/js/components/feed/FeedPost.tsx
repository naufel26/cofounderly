import { useState } from "react";
import { Heart, MessageCircle, Share2, UserPlus, MoreHorizontal, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export type UserRole = "Founder" | "Investor" | "Advisor" | "Team";

export interface PostData {
  id: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
    role: UserRole;
    tagline: string;
  };
  content: string;
  image?: string;
  link?: { title: string; url: string };
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  isConnected: boolean;
  source: "connection" | "suggested" | "team" | "advisor";
}

interface FeedPostProps {
  post: PostData;
  onConnect: (postId: string) => void;
}

const getRoleBadgeClass = (role: UserRole) => {
  switch (role) {
    case "Founder":
      return "badge-founder";
    case "Investor":
      return "badge-investor";
    case "Advisor":
      return "badge-advisor";
    case "Team":
      return "badge-team";
    default:
      return "badge-founder";
  }
};

const getSourceLabel = (source: PostData["source"]) => {
  switch (source) {
    case "connection":
      return null;
    case "suggested":
      return "Suggested for you";
    case "team":
      return "From a startup team";
    case "advisor":
      return "Advisor insight";
    default:
      return null;
  }
};

export const FeedPost = ({ post, onConnect }: FeedPostProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onConnect(post.id);
    setIsConnecting(false);
    toast.success(`Connection request sent to ${post.author.name}`);
  };

  const handleShare = () => {
    toast.success("Post link copied to clipboard!");
  };

  const handleComment = () => {
    toast.info("Comments panel opening...");
  };

  const sourceLabel = getSourceLabel(post.source);

  return (
    <article className="card-elevated overflow-hidden animate-fade-in">
      {/* Source indicator */}
      {sourceLabel && (
        <div className="px-4 pt-3 pb-0">
          <span className="text-xs text-muted-foreground">{sourceLabel}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {post.author.initials}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                {post.author.name}
              </h3>
              <span className={getRoleBadgeClass(post.author.role)}>{post.author.role}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{post.author.tagline}</p>
            <p className="text-xs text-muted-foreground mt-1">{post.timeAgo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!post.isConnected && (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
            >
              {isConnecting ? (
                <Check className="h-4 w-4 animate-pulse-subtle" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              <span>Connect</span>
            </button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save post</DropdownMenuItem>
              <DropdownMenuItem>Hide post</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Link Preview */}
      {post.link && (
        <div className="mx-4 mb-3 rounded-lg border border-border overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="p-3">
            <p className="text-sm font-medium text-foreground">{post.link.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{post.link.url}</p>
          </div>
        </div>
      )}

      {/* Image */}
      {post.image && (
        <div className="mx-4 mb-3 rounded-lg overflow-hidden">
          <img src={post.image} alt="Post content" className="w-full object-cover" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-muted-foreground border-t border-border">
        <span>{likeCount} likes</span>
        <div className="flex gap-3">
          <span>{post.comments} comments</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 flex items-center justify-between border-t border-border">
        <button
          onClick={handleLike}
          className={`feed-action flex-1 justify-center ${liked ? 'text-accent' : ''}`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          <span>Like</span>
        </button>
        
        <button onClick={handleComment} className="feed-action flex-1 justify-center">
          <MessageCircle className="h-4 w-4" />
          <span>Comment</span>
        </button>
        
        <button onClick={handleShare} className="feed-action flex-1 justify-center">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
};
