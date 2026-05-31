"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  signupThunk,
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";

interface SignUpFields {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  remember: boolean;
}

const initialState: SignUpFields = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  remember: false,
};

export default function SignUpPage() {
  const [fields, setFields] = useState<SignUpFields>(initialState);
  const [clientError, setClientError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setClientError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (fields.password.length < 6) {
      setClientError("Password must be at least 6 characters");
      return;
    }

    if (fields.password !== fields.confirmPassword) {
      setClientError("Passwords do not match");
      return;
    }

    dispatch(
      signupThunk({
        name: `${fields.firstName} ${fields.lastName}`.trim(),
        email: fields.email,
        password: fields.password,
      })
    );
  };

  const displayError = clientError || error;

  return (
    <div className="min-h-screen bg-[#447270] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm px-8 py-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/"
            className="w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Go back"
          >
            <Image src="/backAero.png" alt="Back" width={36} height={36} unoptimized />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 absolute left-1/2 -translate-x-1/2">
            Sign up
          </h1>
        </div>

        {displayError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="firstName"
              placeholder="First name"
              value={fields.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
            />
            <Input
              name="lastName"
              placeholder="Last name"
              value={fields.lastName}
              onChange={handleChange}
              required
              autoComplete="family-name"
            />
          </div>

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
            name="mobile"
            type="tel"
            placeholder="Mobile Number (optional)"
            value={fields.mobile}
            onChange={handleChange}
            autoComplete="tel"
          />

          <Input
            name="password"
            type="password"
            placeholder="Password (min 6 characters)"
            value={fields.password}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={fields.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3D6B6B] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#2f5656] transition-colors mt-2 disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
