"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviews?: number;
  className?: string;
}

export function StarRating({ rating, reviews, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-axo-border text-axo-border"
            }
          />
        ))}
      </div>
      <span className="text-xs text-axo-muted">
        {rating.toFixed(1)}
        {reviews !== undefined && (
          <span className="ml-1">({reviews})</span>
        )}
      </span>
    </div>
  );
}
