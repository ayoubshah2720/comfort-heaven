import { Input } from "@/components/ui";

interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  fax: string;
}

interface CheckoutPersonalDetailsProps {
  personal: PersonalDetails;
  onPersonalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type { PersonalDetails };

export default function CheckoutPersonalDetails({
  personal,
  onPersonalChange,
}: CheckoutPersonalDetailsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5 text-gray-700"
        >
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M20 8v6M23 11h-6" />
        </svg>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
          Your Personal Details
        </h2>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name *"
            name="firstName"
            value={personal.firstName}
            onChange={onPersonalChange}
            placeholder="First Name"
            required
          />
          <Input
            label="Last Name *"
            name="lastName"
            value={personal.lastName}
            onChange={onPersonalChange}
            placeholder="Last Name"
            required
          />
        </div>
        <Input
          label="Email *"
          name="email"
          type="email"
          value={personal.email}
          onChange={onPersonalChange}
          placeholder="Email"
          required
        />
        <Input
          label="Telephone *"
          name="telephone"
          type="tel"
          value={personal.telephone}
          onChange={onPersonalChange}
          placeholder="Telephone"
          required
        />
        <Input
          label="Fax"
          name="fax"
          value={personal.fax}
          onChange={onPersonalChange}
          placeholder="Fax"
        />
      </div>
    </div>
  );
}
