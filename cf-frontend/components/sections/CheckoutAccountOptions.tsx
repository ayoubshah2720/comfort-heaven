type AccountOption = "register" | "guest" | "returning";

interface CheckoutAccountOptionsProps {
  selected: AccountOption;
  onChange: (value: AccountOption) => void;
}

const options: { value: AccountOption; label: string }[] = [
  { value: "register", label: "Register Account" },
  { value: "guest", label: "Guest Checkout" },
  { value: "returning", label: "Returning Customer" },
];

export type { AccountOption };

export default function CheckoutAccountOptions({ selected, onChange }: CheckoutAccountOptionsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-700">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
          Create An Account Or Login
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="accountOption"
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-[#3D6B6B]"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
