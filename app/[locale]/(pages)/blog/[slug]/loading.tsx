import Skeleton from '@/components/Skeleton';

export default function BlogDetailLoading() {
  return (
    <main className="min-h-screen bg-noir text-cream">
      <Skeleton className="h-[50vh] w-full rounded-none" />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[680px] space-y-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </section>
    </main>
  );
}
