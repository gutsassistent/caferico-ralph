import Skeleton, { HeroSkeleton } from '@/components/Skeleton';

export default function FaqLoading() {
  return (
    <main className="min-h-screen bg-noir text-cream">
      <HeroSkeleton />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="mx-auto h-10 w-full max-w-md rounded-lg" />
          <div className="flex justify-center gap-3 py-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </section>
    </main>
  );
}
