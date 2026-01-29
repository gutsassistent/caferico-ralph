type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-cream/10 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-cream/5 to-transparent" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-cream/10 bg-surface-darkest">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-cream/10 bg-surface-darkest">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      <div className="mx-auto max-w-3xl space-y-6 px-6 text-center">
        <Skeleton className="mx-auto h-4 w-32" />
        <Skeleton className="mx-auto h-10 w-3/4" />
        <Skeleton className="mx-auto h-4 w-2/3" />
      </div>
    </section>
  );
}
