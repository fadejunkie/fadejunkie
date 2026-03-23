"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { Plus, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface GalleryGridProps {
  barberId: Id<"barbers">;
  editable?: boolean;
}

export default function GalleryGrid({ barberId, editable = false }: GalleryGridProps) {
  const photos = useQuery(api.gallery.getGalleryForBarber, { barberId });
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addPhoto = useMutation(api.gallery.addGalleryPhoto);
  const deletePhoto = useMutation(api.gallery.deleteGalleryPhoto);

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      await addPhoto({ barberId, storageId });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (!photos) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {editable && (
        <div className="mb-3">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <Button variant="outline" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}>
            <Plus size={14} />
            Add photo
          </Button>
        </div>
      )}

      {photos.length === 0 && (
        <p className="text-sm text-muted-foreground py-4">
          {editable ? "No photos yet — upload your first cut." : "No photos yet."}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <div key={photo._id} className="relative aspect-square group rounded overflow-hidden bg-muted">
            <Image
              src={photo.url}
              alt={photo.caption ?? "Gallery photo"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 200px"
            />
            {editable && (
              <button
                onClick={() => deletePhoto({ photoId: photo._id })}
                className="absolute top-1 right-1 w-6 h-6 bg-foreground/60 text-primary-foreground rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
