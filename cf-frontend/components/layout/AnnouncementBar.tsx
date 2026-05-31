"use client";

import { useState, useRef, useEffect } from "react";
import { TruckIcon } from "../icons";
import { MapPinIcon, ShoppingCartIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon, EyeSlashIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AnnouncementLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AnnouncementBarProps {
  leftLinks?: AnnouncementLink[];
  rightLinks?: AnnouncementLink[];
}

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: "en", label: "English", flag: "https://flagcdn.com/16x12/us.png" },
  { code: "ur", label: "اردو", flag: "https://flagcdn.com/16x12/pk.png" },
];

const defaultLeftLinks: AnnouncementLink[] = [
  { label: "Free Shipping", href: "#", icon: <TruckIcon width={16} height={16} /> },
  { label: "Warranty", href: "#", icon: <ShieldCheckIcon width={16} height={16} /> },
  { label: "Showroom Locations", href: "#", icon: <MapPinIcon width={16} height={16} /> },
  { label: "Click & Collect", href: "#", icon: <ShoppingCartIcon width={16} height={16} /> },
];

const defaultRightLinks: AnnouncementLink[] = [
  { label: "Track Order", href: "#", icon: <TruckIcon width={16} height={16} /> },
  { label: "For Help", href: "#", icon: <QuestionMarkCircleIcon width={16} height={16} /> },
  { label: "Visual Showroom", href: "#", icon: <EyeSlashIcon width={16} height={16} /> },
];

export default function AnnouncementBar({
  leftLinks = defaultLeftLinks,
  rightLinks = defaultRightLinks,
}: AnnouncementBarProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(languageOptions[0]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleLanguageSelect(lang: LanguageOption) {
    setSelectedLanguage(lang);
    setOpen(false);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      window.addEventListener("mousedown", handleClick);
    }
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="bg-[#E8B800] text-white text-xs py-1.5 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {leftLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:underline">
              <div className="flex items-center gap-2">
                {link.icon}
                <span className="hidden md:inline">{link.label}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {rightLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:underline">
                <div className="flex items-center gap-2">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}
          </div>
          {/* Language Changer */}
          <div ref={dropdownRef} className="relative z-10">
            <button
              type="button"
              className="flex items-center gap-1.5 bg-transparent text-white rounded px-2 py-0.5 text-xs focus:outline-none focus:ring focus:ring-white/40 group"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label="Select Language"
              onClick={() => setOpen((open) => !open)}
            >
              <span className="font-semibold tracking-wide">{selectedLanguage.code.toUpperCase()}</span>
              <span>
                <Image
                  src={selectedLanguage.flag}
                  alt={`${selectedLanguage.label} flag`}
                  width={22}
                  height={15}
                  className="inline-block rounded-[2px] border border-white/70"
                  priority
                  unoptimized
                />
              </span>
              <ChevronDownIcon
                className={`w-5 h-5 ml-1 text-white transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {open && (
              <ul
                className="absolute right-0 mt-1 min-w-[120px] bg-white text-black rounded shadow-lg overflow-hidden text-sm"
                tabIndex={-1}
                role="listbox"
              >
                {languageOptions.map((lang) => (
                  <li
                    key={lang.code}
                    role="option"
                    aria-selected={lang.code === selectedLanguage.code}
                  >
                    <button
                      type="button"
                      className={`w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 ${lang.code === selectedLanguage.code ? "font-semibold bg-gray-50" : ""}`}
                      onClick={() => handleLanguageSelect(lang)}
                    >
                      <span>
                        <Image
                          src={lang.flag}
                          alt={`${lang.label} flag`}
                          width={22}
                          height={15}
                          className="inline-block rounded-[2px] "
                          priority
                          unoptimized
                        />
                      </span>
                      <span>{lang.code.toUpperCase()}</span>
                      <span className="ml-2 text-xs text-gray-500">{lang.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
