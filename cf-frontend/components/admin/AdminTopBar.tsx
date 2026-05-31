"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUser, logoutThunk } from "@/store/slices/authSlice";
import Button from "@/components/ui/Button";

interface AdminTopBarProps {
  title: string;
  onMenuToggle: () => void;
}

export default function AdminTopBar({ title, onMenuToggle }: AdminTopBarProps) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-gray-500 sm:block">
          {user?.name}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(logoutThunk())}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
