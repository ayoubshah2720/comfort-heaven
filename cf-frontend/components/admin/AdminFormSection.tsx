interface AdminFormSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminFormSection({ title, children }: AdminFormSectionProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h3>
      {children}
    </div>
  );
}
