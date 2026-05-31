"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleCategory,
  toggleManufacturer,
  setPriceRange,
  toggleColor,
  selectFilters,
} from "@/store/slices/filtersSlice";

const categories = [
  "Wood Chair",
  "Kiwi Chairs",
  "Office Chairs",
  "Cherry Chairs",
  "Bob Chairs",
  "Alexis Chairs",
  "Grant Chairs",
];

const manufacturers = ["G Plan", "Wood Style", "Dura Chairs", "Cherry Chairs", "Bob Chairs"];

const colors = [
  { name: "Red", hex: "#e53e3e" },
  { name: "Blue", hex: "#3182ce" },
  { name: "Orange", hex: "#dd6b20" },
  { name: "Purple", hex: "#805ad5" },
  { name: "Black", hex: "#000000" },
  { name: "Yellow", hex: "#E8B800" },
];

const bestSellers = [
  {
    id: 1,
    name: "ALIQUAM EGET LEO FAUCIBUS",
    price: 129,
    originalPrice: 165,
    rating: 5,
    imageSrc: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=80&q=80",
  },
  {
    id: 2,
    name: "ALIQUAM EGET LEO FAUCIBUS",
    price: 129,
    originalPrice: 165,
    rating: 5,
    imageSrc: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&q=80",
  },
  {
    id: 3,
    name: "ALIQUAM EGET LEO FAUCIBUS",
    price: 139,
    originalPrice: 165,
    rating: 5,
    imageSrc: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=80&q=80",
  },
];

function SidebarHeader({ title }: { title: string }) {
  return (
    <div className="bg-[#3D6B6B] text-white text-xs font-semibold uppercase tracking-wider px-3 py-2 mb-3">
      {title}
    </div>
  );
}

export default function ShopSidebar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  return (
    <aside className="w-48 flex-shrink-0">
      <SidebarHeader title="SHOP BY" />

      {/* CATEGORY */}
      <div className="mb-5 px-1">
        <SidebarHeader title="CATEGORY" />
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => dispatch(toggleCategory(cat))}
                className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${filters.selectedCategories.includes(cat)
                    ? "bg-[#3D6B6B] border-[#3D6B6B]"
                    : "border-gray-400 group-hover:border-[#3D6B6B]"
                  }`}
              >
                {filters.selectedCategories.includes(cat) && (
                  <svg viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M1.5 5l2.5 3L8.5 2" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => dispatch(toggleCategory(cat))}
                className="text-xs text-gray-600 cursor-pointer"
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div className="mb-5 px-1">
        <SidebarHeader title="PRICE" />
        <div className="flex items-center gap-1.5 mb-2">
          <div className="border border-gray-300 px-2 py-1 text-[10px] text-gray-600 uppercase">
            Rs {filters.priceMin}
          </div>
          <div className="border border-gray-300 px-2 py-1 text-[10px] text-gray-600 uppercase">
            Rs {filters.priceMax}
          </div>
          <button className="bg-[#E8B800] text-white text-[10px] font-semibold px-3 py-1 hover:bg-[#d4a700] transition-colors uppercase tracking-wide">
            SEARCH
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={999}
          value={filters.priceMax}
          onChange={(e) =>
            dispatch(
              setPriceRange({ min: filters.priceMin, max: Number(e.target.value) })
            )
          }
          className="w-full accent-[#E8B800] cursor-pointer"
        />
      </div>

      {/* MANUFACTURER */}
      <div className="mb-5 px-1">
        <SidebarHeader title="MANUFACTURER" />
        <div className="flex flex-col gap-1.5">
          {manufacturers.map((mfr) => (
            <label key={mfr} className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => dispatch(toggleManufacturer(mfr))}
                className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${filters.selectedManufacturers.includes(mfr)
                    ? "bg-[#3D6B6B] border-[#3D6B6B]"
                    : "border-gray-400 group-hover:border-[#3D6B6B]"
                  }`}
              >
                {filters.selectedManufacturers.includes(mfr) && (
                  <svg viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M1.5 5l2.5 3L8.5 2" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => dispatch(toggleManufacturer(mfr))}
                className="text-xs text-gray-600 cursor-pointer"
              >
                {mfr}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* COLOR */}
      <div className="mb-5 px-1">
        <SidebarHeader title="COLOR" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {colors.map((color) => (
            <div
              key={color.name}
              onClick={() => dispatch(toggleColor(color.name))}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded-sm flex-shrink-0 transition-all ${filters.selectedColors.includes(color.name)
                    ? "ring-2 ring-[#3D6B6B]"
                    : "ring-1 ring-gray-200 group-hover:ring-[#3D6B6B]"
                  }`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs text-gray-600">{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BEST SELLER */}
      <div className="px-1">
        <SidebarHeader title="BEST SELLER" />
        <div className="flex flex-col gap-3">
          {bestSellers.map((item) => (
            <div key={item.id} className="flex gap-2">
              <div className="w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-gray-700 leading-tight">{item.name}</p>
                <div className="flex gap-0.5 my-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-xs ${i < item.rating ? "text-[#E8B800]" : "text-gray-300"}`}>
                      ★
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5 text-[10px]">
                  <span className="text-[#3D6B6B] font-bold">Rs {item.price}.00</span>
                  <span className="text-gray-400 line-through">Rs {item.originalPrice}.00</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
