'use client';

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-stone-800">Er ging iets mis in de shop</h1>
      <p className="mt-2 text-stone-600">
        {error.digest ? `Foutcode: ${error.digest}` : 'Probeer het opnieuw.'}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-amber-700 px-6 py-2 text-white hover:bg-amber-800 transition-colors"
      >
        Opnieuw proberen
      </button>
    </main>
  );
}
