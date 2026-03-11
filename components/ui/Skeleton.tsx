"use client";

import { useState, useEffect } from "react";

export function useDelayedLoad(delay = 800) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready;
}

export function ShimmerBlock({ className }: { className?: string }) {
  return <div className={`shimmer-bar rounded ${className ?? ""}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-border rounded-lg p-5 flex flex-col gap-3">
      <ShimmerBlock className="h-3 w-24" />
      <ShimmerBlock className="h-9 w-20" />
      <ShimmerBlock className="h-3 w-full" />
      <ShimmerBlock className="h-12 w-full" />
    </div>
  );
}

export function SkeletonRows({ count = 4 }: { count?: number }) {
  return (
    <div className="bg-white border border-border rounded-lg p-5 flex flex-col gap-3">
      <ShimmerBlock className="h-3 w-32" />
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerBlock key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
