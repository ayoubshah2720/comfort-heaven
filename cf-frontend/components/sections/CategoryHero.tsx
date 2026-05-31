import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface CategoryHeroProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  backgroundImage?: string;
}

export default function CategoryHero({ title, breadcrumbs, backgroundImage }: CategoryHeroProps) {
  return (
    <div
      className="relative w-full h-72 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: backgroundImage ? undefined : "#4a4a4a",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">{title}</h1>
        <div className="flex items-center justify-center gap-1 text-sm text-gray-200">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-400 mx-0.5">›</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[#E8B800] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
