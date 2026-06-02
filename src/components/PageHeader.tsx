interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="text-center">
      <h1 className="text-page-title">{title}</h1>
      {subtitle && <p className="text-page-sub mt-1">{subtitle}</p>}
    </header>
  );
}
