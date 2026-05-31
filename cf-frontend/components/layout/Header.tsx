"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectWishlistCount } from "@/store/slices/wishlistSlice";
import SearchBar from "@/components/layout/SearchBar";
import {
  selectIsAuthenticated,
  selectUser,
  logoutThunk,
} from "@/store/slices/authSlice";
import { selectHeaderCategories } from "@/store/slices/headerCategoriesSlice";
import Logo from "@/assets/icon.svg"
import Image from "next/image";
import { HeartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";


interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  highlight?: "red" | "yellow";
}

const fallbackCategoryItems: NavItem[] = [
  { label: "Living Room", href: "/categories/living-room" },
  { label: "Bedroom", href: "/categories/bedroom" },
  { label: "Kitchen & Dining", href: "/categories/kitchen-dining" },
  { label: "Home Office", href: "/categories/home-office" },
  { label: "Lighting", href: "/categories/lighting" },
  { label: "Decor & Accessories", href: "/categories/decor-accessories" },
  { label: "Kids & Nursery", href: "/categories/kids-nursery" },
];

const staticItems: NavItem[] = [
  { label: "Don't Miss It", href: "#", highlight: "red" },
  { label: "New Arrivals", href: "/new-arrivals", highlight: "yellow" },
];


export default function Header() {
  const dispatch = useAppDispatch();
  const wishlistCount = useAppSelector(selectWishlistCount);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const headerCategories = useAppSelector(selectHeaderCategories);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categoryItems: NavItem[] =
    headerCategories.length > 0
      ? headerCategories.map((cat) => ({
          label: cat.name,
          href: `/categories/${cat.slug}`,
        }))
      : fallbackCategoryItems;

  const navItems: NavItem[] = [...categoryItems, ...staticItems];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <button
          className="lg:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex-shrink-0 w-10 h-10 bg-[#E8B800] flex items-center justify-center rounded text-white font-bold text-xs">
            <Image src={Logo} alt="Logo" width={30} height={30} unoptimized />
          </Link>

          <SearchBar className="hidden sm:block" />
        </div>

        {/* Cart + Auth */}
        <div className="flex items-center gap-4 text-sm text-gray-600 flex-shrink-0 ml-auto">
          <Link href="/profile/wishlist/" className="relative hover:text-[#E8B800]" aria-label="Wishlist">
            <HeartIcon className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E8B800] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <span className="text-gray-300 hidden sm:inline">|</span>
          {isAuthenticated && user ? (
            <Link href="/profile/wishlist/" className="hidden sm:flex items-center gap-2">
              <span className="text-gray-700 font-medium">{user.name.split(" ")[0]}</span>
              <button
                onClick={() => dispatch(logoutThunk())}
                className="hover:text-[#E8B800]"
              >
                Sign Out
              </button>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/signin" className="hover:text-[#E8B800]">Sign In</Link>
              <span>-</span>
              <Link href="/signup" className="hover:text-[#E8B800]">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      <div className="sm:hidden px-4 pb-3">
        <SearchBar />
      </div>

      <nav className="hidden lg:flex">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-3 text-sm whitespace-nowrap transition-colors ${item.highlight === "yellow"
                ? "text-[#E8B800] font-semibold hover:text-[#d4a700]"
                : item.highlight === "red"
                  ? "text-red-400 font-semibold hover:text-red-300"
                  : item.active
                    ? "text-[#E8B800] font-semibold"
                    : "text-black hover:text-[#E8B800]"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 lg:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-shrink-0 w-10 h-10 bg-[#E8B800] flex items-center justify-center rounded text-white font-bold text-xs">
            <Image src={Logo} alt="Logo" width={30} height={30} unoptimized />
          </div>
          <button
            className="w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <nav className="flex flex-col py-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-6 py-3 text-sm transition-colors ${item.highlight === "yellow"
                ? "text-[#E8B800] font-semibold hover:text-[#d4a700]"
                : item.highlight === "red"
                  ? "text-red-400 font-semibold hover:text-red-300"
                  : item.active
                    ? "text-[#E8B800] font-semibold"
                    : "text-black hover:text-[#E8B800]"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t px-6 py-4 mt-auto">
          {isAuthenticated && user ? (
            <div className="flex flex-col gap-3 text-sm">
              <span className="text-gray-700 font-medium">{user.name.split(" ")[0]}</span>
              <button
                onClick={() => {
                  dispatch(logoutThunk());
                  setMobileMenuOpen(false);
                }}
                className="text-left text-gray-600 hover:text-[#E8B800] py-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/signin" className="text-gray-600 hover:text-[#E8B800] py-1">Sign In</Link>
              <Link href="/signup" className="text-gray-600 hover:text-[#E8B800] py-1">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
