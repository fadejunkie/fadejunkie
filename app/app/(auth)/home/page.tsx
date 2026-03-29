"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

export default function HomePage() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.listFeedPosts,
    {},
    { initialNumItems: PAGE_SIZE }
  );

  return (
    <div className="space-y-6">
      <PostComposer />

      {status === "LoadingFirstPage" && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 h-24 animate-pulse" />
          ))}
        </div>
      )}

      {results.length === 0 && status !== "LoadingFirstPage" && (
        <div className="text-center py-16">
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            The feed is empty — be the first to post.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((post) => (
          <PostCard
            key={post._id}
            postId={post._id}
            authorId={post.authorId}
            barberName={post.barberName}
            barberSlug={post.barberSlug}
            barberAvatarUrl={post.barberAvatarUrl}
            content={post.content}
            imageUrl={post.imageUrl}
            likeCount={post.likeCount}
            liked={post.liked}
            isOwn={post.isOwn}
            createdAt={post.createdAt}
          />
        ))}
      </div>

      {status === "CanLoadMore" && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={() => loadMore(PAGE_SIZE)}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
