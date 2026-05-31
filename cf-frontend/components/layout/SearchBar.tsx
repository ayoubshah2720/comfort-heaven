"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSearchQuery, setSearchQuery } from "@/store/slices/searchSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { apiSearchProducts } from "@/lib/search-api";
import SearchDropdown from "@/components/layout/SearchDropdown";
import type { BackendProduct } from "@/types/product";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const query = useAppSelector(selectSearchQuery);
  const debouncedQuery = useDebounce(query, 300);

  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setProducts([]);
      setIsOpen(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setIsOpen(true);

    apiSearchProducts(debouncedQuery, 6, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        setProducts(response.data.products);
        setIsLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setProducts([]);
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("mousedown", handleClick);
    }
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  }, [query, router]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter") {
      handleSearch();
    }
  }

  function handleSelect() {
    setIsOpen(false);
    dispatch(setSearchQuery(""));
  }

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (debouncedQuery.length >= 2) setIsOpen(true);
          }}
          placeholder="Enter Your Keywords..."
          className="flex-1 border border-gray-300 rounded-l px-4 py-2 text-sm outline-none focus:border-[#E8B800]"
        />
        <button
          onClick={handleSearch}
          className="bg-[#E8B800] text-white px-5 py-2 rounded-r text-sm font-semibold hover:bg-[#d4a700] transition-colors"
        >
          SEARCH
        </button>
      </div>
      {isOpen && (
        <SearchDropdown
          products={products}
          isLoading={isLoading}
          query={debouncedQuery}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
