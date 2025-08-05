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
      <h2 className="text-center text-4xl">Ямар нэг зүйл буруу байна</h2>
      <p className="my-8">{error.message}</p>
      <button onClick={() => reset()}>Ахин оролдоно уу !!</button>
    </div>
  );
}
