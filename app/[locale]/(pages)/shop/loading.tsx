import { HeroSkeleton, ProductCardSkeleton } from '@/components/Skeleton';

export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-noir text-cream">
      <HeroSkeleton />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
