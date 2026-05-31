type BadgeVariant = "active" | "inactive" | "admin" | "user";

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
  admin: "bg-[#E8B800]/15 text-[#b8920a]",
  user: "bg-gray-100 text-gray-600",
};

const defaultLabels: Record<BadgeVariant, string> = {
  active: "Active",
  inactive: "Inactive",
  admin: "Admin",
  user: "User",
};

export default function StatusBadge({ variant, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}
    >
      {label || defaultLabels[variant]}
    </span>
  );
}
