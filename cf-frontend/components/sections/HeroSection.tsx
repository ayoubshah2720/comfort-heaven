import Link from "next/link";
import Button from "@/components/ui/Button";
import Image from "next/image";

interface HeroSectionProps {
  title?: string;
  highlightedWord?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function HeroSection({
  title = "Top Rated",
  highlightedWord = "Furniture",
  subtitle = "Exclusively\nHand Picked for\n",
  ctaLabel = "SHOP NOW",
  ctaHref = "#",
  imageSrc = "/sofa.png",
  imageAlt = "Top Rated Furniture",
}: HeroSectionProps) {
  return (
    <section className="bg-[#3D6B6B] relative overflow-hidden min-h-[280px] sm:min-h-[350px] lg:min-h-[420px] flex items-center">
      {/* Decorative dots */}
      <div className="absolute right-20 top-10 opacity-30 hidden md:block">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#E8B800]" />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col md:flex-row items-center justify-between py-8 md:py-12 gap-6 md:gap-8">
        {/* Text */}
        <div className="text-white z-10 max-w-full md:max-w-sm text-center md:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {title}
            <br />
            <span className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{highlightedWord}</span>
          </h1>
          <hr className="my-4 border-white " />
          <p className="mt-4 whitespace-pre-line leading-relaxed text-white text-base sm:text-xl md:text-2xl lg:text-3xl">
            {subtitle}
            <span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">You!</span>
          </p>
          <Link href={ctaHref} className="mt-6 inline-block">
            <Button size="md" className="bg-[#E8B800] hover:bg-[#d4a700] rounded-none px-6 py-2 font-bold tracking-wide text-white text-sm sm:text-base md:text-xl lg:text-3xl">
              {ctaLabel}
            </Button>
          </Link>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center md:justify-end items-end z-10">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={400}
            height={320}
            priority
            className="max-h-48 sm:max-h-60 md:max-h-72 lg:max-h-80 w-auto object-contain drop-shadow-2xl"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
