import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-[#3D6B6B] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Category Not Found</h2>
        <p className="text-gray-500 mb-6">The category you are looking for does not exist.</p>
        <Link
          href="/"
          className="inline-block bg-[#E8B800] text-black font-semibold px-8 py-3 hover:bg-[#d4a700] transition-colors uppercase tracking-wide"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
