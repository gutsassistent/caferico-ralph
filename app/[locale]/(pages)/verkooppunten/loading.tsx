import Skeleton, { HeroSkeleton } from '@/components/Skeleton';

export default function LocationsLoading() {
  return (
    <main className="min-h-screen bg-noir text-cream">
      <HeroSkeleton />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-28 rounded-full" />
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-cream/10 bg-surface-darkest p-6">
                <Skeleton className="mb-4 h-10 w-10 rounded-full" />
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="mb-1 h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
