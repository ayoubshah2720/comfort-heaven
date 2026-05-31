"use client";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginThunk,
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";

interface SignInFields {
  email: string;
  password: string;
  remember: boolean;
}

const initialState: SignInFields = {
  email: "",
  password: "",
  remember: false,
};

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#447270] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8B800] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const [fields, setFields] = useState<SignInFields>(initialState);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      const returnUrl = searchParams.get("returnUrl");
      router.push(returnUrl || "/");
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ email: fields.email, password: fields.password }));
  };

  return (
    <div className="min-h-screen bg-[#447270] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm px-8 py-10">
        {/* Header */}
        <div className="relative flex items-center mb-8">
          <Link
            href="/"
            className="w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Go back"
          >
            <Image src="/backAero.png" alt="Back" width={36} height={36} unoptimized />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 absolute left-1/2 -translate-x-1/2">
            Log In
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={fields.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={fields.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="remember"
              checked={fields.remember}
              onChange={handleChange}
              className="w-4 h-4 accent-[#3D6B6B]"
            />
            <span className="text-xs text-gray-500">Remember me</span>
          </label>

          {/* Log In button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8B800] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#d4a700] transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {/* Sign Up button */}
          <Link
            href="/signup"
            className="w-full block text-center bg-[#3D6B6B] text-[#E8B800] py-3 rounded-lg text-sm font-semibold hover:bg-[#2f5656] transition-colors"
          >
            Sign Up
          </Link>

          {/* Forgot password */}
          <p className="text-center">
            <Link href="#" className="text-xs text-gray-400 hover:text-[#E8B800] transition-colors">
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
