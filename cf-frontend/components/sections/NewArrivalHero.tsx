interface NewArrivalHeroProps {
  backgroundImage?: string;
  tagline?: string;
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function NewArrivalHero({
  backgroundImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=80",
  tagline = "EXCEPTIONAL HOME FURNITURE",
  title = "NEW ARRIVAL",
  ctaLabel = "SHOP NOW",
  ctaHref = "#products",
}: NewArrivalHeroProps) {
  return (
    <section
      className="relative min-h-[400px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 bg-white/85 backdrop-blur-sm px-12 py-10 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-600 mb-2">
          {tagline}
        </p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <a
          href={ctaHref}
          className="text-sm font-semibold text-[#E8B800] underline underline-offset-4 hover:text-[#d4a700] transition-colors"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
