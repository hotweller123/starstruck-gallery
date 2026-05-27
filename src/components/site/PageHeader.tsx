interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="mx-auto max-w-7xl px-6 pb-16 pt-20 md:pb-20 md:pt-28">
      {eyebrow && (
        <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-detail">
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-4xl font-display text-5xl italic leading-[0.95] md:text-7xl lg:text-8xl">
        {title}
      </h1>
      {description && (
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-detail md:text-xl">
          {description}
        </p>
      )}
    </header>
  );
}
