"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2 className="text-center text-4xl">Something went wrong!</h2>
      <p className="my-8">{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
