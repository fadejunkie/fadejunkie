"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Avatar from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";

export default function PostComposer() {
  const barber = useQuery(api.barbers.getMyBarberProfile);
  const createPost = useMutation(api.posts.createPost);

  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      await createPost({ content });
      setContent("");
    } finally {
      setPosting(false);
    }
  }

  const remaining = 500 - content.length;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border p-5" style={{ borderRadius: "20px" }}>
      <div className="flex gap-3">
        <Avatar src={barber?.avatarUrl} name={barber?.name ?? "?"} size={36} />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            maxLength={500}
            className="w-full text-sm text-foreground placeholder:text-muted-foreground/70 resize-none bg-transparent focus:outline-none"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <span className={`text-xs ${remaining < 50 ? "text-destructive" : "text-muted-foreground"}`}>
              {remaining}
            </span>
            <Button type="submit" size="sm" loading={posting} disabled={!content.trim()}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
