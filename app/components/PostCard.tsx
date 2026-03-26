"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Heart, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Avatar from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PostCardProps {
  postId: Id<"posts">;
  barberName: string | null;
  barberSlug: string | null;
  barberAvatarUrl: string | null;
  content: string;
  imageUrl?: string | null;
  likeCount: number;
  liked: boolean;
  isOwn: boolean;
  createdAt: number;
}

export default function PostCard({
  postId, barberName, barberSlug, barberAvatarUrl,
  content, imageUrl, likeCount, liked: initialLiked, isOwn, createdAt,
}: PostCardProps) {
  const toggleLike = useMutation(api.likes.toggleLike);
  const deletePost = useMutation(api.posts.deletePost);

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const [deleting, setDeleting] = useState(false);

  async function handleLike() {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => (wasLiked ? c - 1 : c + 1));
    await toggleLike({ postId });
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    await deletePost({ postId });
  }

  return (
    <div className="bg-card border border-border p-5" style={{ borderRadius: "20px" }}>
      <div className="flex items-start gap-3">
        <Avatar src={barberAvatarUrl} name={barberName ?? "?"} size={36} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            {barberSlug ? (
              <Link href={`/barber/${barberSlug}`} className="text-sm font-semibold text-foreground hover:underline">
                {barberName ?? "Barber"}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-foreground">{barberName ?? "Barber"}</span>
            )}
            {barberSlug && (
              <span className="text-xs text-muted-foreground font-mono">@{barberSlug}</span>
            )}
            <span className="text-xs text-muted-foreground ml-auto">{formatTimeAgo(createdAt)}</span>
          </div>

          <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>

          {imageUrl && (
            <div className="mt-3 relative aspect-video max-h-80 rounded overflow-hidden bg-muted">
              <Image src={imageUrl} alt="Post image" fill className="object-cover" sizes="600px" />
            </div>
          )}

          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors duration-150",
                liked
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={{ letterSpacing: "-0.01em" }}
            >
              <Heart
                size={14}
                fill={liked ? "currentColor" : "none"}
                strokeWidth={liked ? 2 : 1.5}
              />
              {count > 0 && count}
            </button>

            {isOwn && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="text-muted-foreground hover:text-destructive ml-auto h-auto py-0 px-1 text-xs"
              >
                <Trash2 size={13} />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(ts).toLocaleDateString();
}
