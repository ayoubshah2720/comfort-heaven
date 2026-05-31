"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectUser,
  selectProfileUpdating,
  selectProfileUpdateError,
  updateProfileThunk,
} from "@/store/slices/authSlice";
import ProfileSidebar from "./ProfileSidebar";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const GENDER_OPTIONS = [
  { value: "", label: "Select Gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function ProfileContent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const updating = useAppSelector(selectProfileUpdating);
  const updateError = useAppSelector(selectProfileUpdateError);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      const [first, ...rest] = (user.name || "").split(" ");
      setFirstName(first);
      setLastName(rest.join(" "));
      setEmail(user.email);
      setUsername(user.username || "");
      setGender(user.gender || "");
      setMobile(user.phone || "");
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage("");
    try {
      await dispatch(
        updateProfileThunk({
          name: `${firstName} ${lastName}`.trim(),
          username: username || undefined,
          phone: mobile || undefined,
          gender: gender || undefined,
        }),
      ).unwrap();
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
    }
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl text-center mb-6">
        My{" "}
        <span className="font-bold text-[#E8B800] underline">PROFILE</span>
      </h1>

      {/* Gold info bar */}
      <div className="bg-[#E8B800] rounded px-6 py-3 flex items-center mb-8">
        <span className="text-white text-sm">Home Page / My Profile</span>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        <ProfileSidebar activeItem="profile" />

        <div className="flex-1 min-w-0">
          {/* Teal header */}
          <div className="bg-[#3D6B6B] text-white px-6 py-3 font-semibold">
            General Information
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                {successMessage}
              </div>
            )}

            {/* Error message */}
            {updateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {updateError}
              </div>
            )}

            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="First Name"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-gray-300 rounded px-3"
              />
              <Input
                label="Last Name"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border border-gray-300 rounded px-3"
              />
              <Input
                label="Username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded px-3"
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="Email"
                value={email}
                disabled
                className="border border-gray-300 rounded px-3 bg-gray-100 cursor-not-allowed"
              />
              <Select
                label="Gender"
                options={GENDER_OPTIONS}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border border-gray-300 rounded px-3"
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Mobile Number</label>
                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                  <span className="flex items-center gap-1 px-3 text-sm text-gray-700 bg-gray-50 border-r border-gray-300 py-2">
                    🇵🇰 +92
                  </span>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="flex-1 py-2 px-3 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={updating}
              className="w-full bg-[#3D6B6B] hover:bg-[#2d5454]"
            >
              {updating ? "Saving..." : "Save"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
