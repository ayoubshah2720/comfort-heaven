import Link from "next/link";
import Button from "@/components/ui/Button";
import { DecorativeLeaf } from "@/components/icons";
import Image from "next/image";

interface CollectionImage {
  src: string;
  alt: string;
}

interface NewArrivalsProps {
  sectionTitle?: string;
  collectionTitle?: string;
  collectionSubtitle?: string;
  tagline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  images?: CollectionImage[];
}

const defaultImages: CollectionImage[] = [
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    alt: "Living room",
  },
  {
    src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    alt: "Luxury sofa",
  },
];

export default function NewArrivals({
  collectionTitle = "SOFA",
  collectionSubtitle = "COLLECTION",
  tagline = "Lowest Price Guaranteed",
  ctaLabel = "EXPLORE NOW",
  ctaHref = "#",
  images = defaultImages,
}: NewArrivalsProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section heading */}
        <h2 className="text-center text-2xl text-gray-800 mb-1 underline underline-offset-8 ">
          New <span className="font-black text-[#3D6B6B]">Arrivals</span>
        </h2>
        <div className="flex justify-center mb-8">
        </div>

        {/* <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/3 flex-shrink-0">
            <DecorativeLeaf className="mb-4" />
            <h3 className="text-5xl font-black text-[#E8B800] leading-none">{collectionTitle}</h3>
            <h3 className="text-4xl font-black text-gray-800 leading-none">{collectionSubtitle}</h3>
            <p className="text-gray-500 text-sm mt-2">{tagline}</p>
            <Link href={ctaHref} className="mt-5 inline-block">
              <Button size="sm" className="rounded-none text-xs px-6">
                {ctaLabel}
              </Button>
            </Link>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded ${i === 1 ? "border-4 border-[#E8B800]" : ""}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                />
                {i === images.length - 1 && (
                  <div className="absolute bottom-3 right-3 w-8 h-8 bg-[#E8B800] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">▶</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div> */}
        <div className="flex flex-col md:flex-row items-center gap-10 justify-center">
          <Image src={"/new-arrival.png"} alt="New Arrivals" width={900} height={1000} className="w-full" unoptimized />
        </div>
      </div>
    </section>
  );
}
