import Skeleton, { HeroSkeleton } from '@/components/Skeleton';

export default function AboutLoading() {
  return (
    <main className="min-h-screen bg-noir text-cream">
      <HeroSkeleton />
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="aspect-video w-full rounded-2xl" />
        </div>
      </section>
    </main>
  );
}
