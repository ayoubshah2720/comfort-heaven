interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8B800]/10 text-[#E8B800]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
