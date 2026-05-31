"use client";

import { useState } from "react";
import { useCategoryFilters } from "./CategoryFilterContext";

function SidebarHeader({ title }: { title: string }) {
  return (
    <div className="bg-[#3D6B6B] text-white text-xs font-semibold uppercase tracking-wider px-3 py-2 mb-3">
      {title}
    </div>
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div
        onClick={onChange}
        className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${checked
            ? "bg-[#3D6B6B] border-[#3D6B6B]"
            : "border-gray-400 group-hover:border-[#3D6B6B]"
          }`}
      >
        {checked && (
          <svg viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M1.5 5l2.5 3L8.5 2" />
          </svg>
        )}
      </div>
      <span onClick={onChange} className="text-xs text-gray-600 cursor-pointer">
        {label}
      </span>
    </label>
  );
}

export default function CategorySidebar() {
  const {
    subcategories,
    brands,
    subCategorySlug,
    brandId,
    minPrice,
    maxPrice,
    setSubCategorySlug,
    setBrandId,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useCategoryFilters();

  const [minInput, setMinInput] = useState(minPrice !== null ? String(minPrice) : "");
  const [maxInput, setMaxInput] = useState(maxPrice !== null ? String(maxPrice) : "");

  function handleSubCategoryToggle(slug: string) {
    setSubCategorySlug(subCategorySlug === slug ? "" : slug);
  }

  function handleBrandToggle(id: string) {
    setBrandId(brandId === id ? "" : id);
  }

  function handlePriceSearch() {
    setMinPrice(minInput ? Number(minInput) : null);
    setMaxPrice(maxInput ? Number(maxInput) : null);
  }

  function handleResetFilters() {
    setMinInput("");
    setMaxInput("");
    resetFilters();
  }

  const hasFilters =
    subCategorySlug !== "" ||
    brandId !== "" ||
    minPrice !== null ||
    maxPrice !== null;

  return (
    <aside className="w-full md:w-48 flex-shrink-0">
      <SidebarHeader title="SHOP BY" />

      {/* SUBCATEGORIES */}
      {subcategories.length > 0 && (
        <div className="mb-5 px-1">
          <SidebarHeader title="SUBCATEGORY" />
          <div className="flex flex-col gap-1.5">
            {subcategories.map((sub) => (
              <Checkbox
                key={sub.id}
                checked={subCategorySlug === sub.slug}
                onChange={() => handleSubCategoryToggle(sub.slug)}
                label={sub.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* PRICE */}
      <div className="mb-5 px-1">
        <SidebarHeader title="PRICE" />
        <div className="flex items-center gap-1.5 mb-2">
          <input
            type="number"
            placeholder="Min"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            className="w-full md:w-16 border border-gray-300 px-2 py-1 text-[10px] text-gray-600"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            className="w-full md:w-16 border border-gray-300 px-2 py-1 text-[10px] text-gray-600"
          />
          <button
            onClick={handlePriceSearch}
            className="bg-[#E8B800] text-white text-[10px] font-semibold px-3 py-1 hover:bg-[#d4a700] transition-colors uppercase tracking-wide"
          >
            SEARCH
          </button>
        </div>
      </div>

      {/* BRANDS */}
      {brands.length > 0 && (
        <div className="mb-5 px-1">
          <SidebarHeader title="BRAND" />
          <div className="flex flex-col gap-1.5">
            {brands.map((brand) => (
              <Checkbox
                key={brand.id}
                checked={brandId === brand.id}
                onChange={() => handleBrandToggle(brand.id)}
                label={brand.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* RESET */}
      {hasFilters && (
        <div className="px-1">
          <button
            onClick={handleResetFilters}
            className="w-full text-xs text-[#3D6B6B] font-semibold border border-[#3D6B6B] py-1.5 hover:bg-[#3D6B6B] hover:text-white transition-colors uppercase tracking-wide"
          >
            RESET FILTERS
          </button>
        </div>
      )}
    </aside>
  );
}
