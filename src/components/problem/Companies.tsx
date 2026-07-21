interface CompaniesProps {
  companies: string[];
}

export default function Companies({ companies }: CompaniesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {companies.map((company) => (
        <span key={company} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          {company}
        </span>
      ))}
    </div>
  );
}
