export default function LoadingCollectionPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 animate-pulse space-y-3 text-center">
        <div className="mx-auto h-4 w-24 rounded bg-brand-cream" />
        <div className="mx-auto h-10 w-64 rounded bg-brand-cream" />
        <div className="mx-auto h-4 w-80 rounded bg-brand-cream" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-square rounded-2xl bg-brand-soft-pink/70" />
        ))}
      </div>
    </div>
  );
}
