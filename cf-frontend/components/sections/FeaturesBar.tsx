import { TruckIcon, StarIcon, PhoneIcon, DollarIcon } from "@/components/icons";
import { ClockIcon } from "@heroicons/react/24/outline";
import { STORE_PHONE_DISPLAY } from "@/constants";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesBarProps {
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    icon: <TruckIcon width={26} height={26} />,
    title: "SAFE SHIPPING",
    description: "In all major cities across Pakistan",
  },
  {
    icon: <ClockIcon width={26} height={26} />,
    title: "CUSTOMER REVIEWS",
    description: "View all customer reviews",
  },
  {
    icon: <PhoneIcon width={26} height={26} />,
    title: "CUSTOMER SUPPORT",
    description: `Call us anytime ${STORE_PHONE_DISPLAY}`,
  },
  {
    icon: <DollarIcon width={26} height={26} />,
    title: "COMPETITIVE PRICES",
    description: "Quality with affordability assured",
  },
];

export default function FeaturesBar({ features = defaultFeatures }: FeaturesBarProps) {
  return (
    <div className="bg-white border border-black/10 rounded-none shadow-none">
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className="flex items-center gap-3 px-5 py-4 sm:py-0 sm:pl-7 sm:first:pl-0"
          >
            <div className="flex items-center justify-center w-12 h-12 text-gray-800">
              {feature.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-800 tracking-wide leading-5">
                {feature.title}
              </span>
              <span className="text-xs text-gray-500 leading-tight font-normal mt-0.5 whitespace-normal sm:whitespace-nowrap">
                {feature.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
