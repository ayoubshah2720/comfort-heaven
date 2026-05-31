"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function CategoryError({ error, reset }: ErrorProps) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Something went wrong</h1>
        <p className="text-gray-500 mb-6">
          {error.message || "Failed to load category. Please try again."}
        </p>
        <button
          onClick={reset}
          className="bg-[#E8B800] text-black font-semibold px-8 py-3 hover:bg-[#d4a700] transition-colors uppercase tracking-wide"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
