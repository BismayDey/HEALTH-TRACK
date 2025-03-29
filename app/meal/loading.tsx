export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0284c7]/20 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-muted-foreground">
          Loading your meal planner...
        </p>
      </div>
    </div>
  );
}
