import Skeleton, { HeroSkeleton } from '@/components/Skeleton';

export default function SubscriptionsLoading() {
  return (
    <main className="min-h-screen bg-noir text-cream">
      <HeroSkeleton />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-cream/10 bg-surface-darkest p-8">
                <Skeleton className="mx-auto h-4 w-20" />
                <Skeleton className="mx-auto mt-4 h-10 w-32" />
                <div className="mt-8 space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="mt-8 h-12 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
