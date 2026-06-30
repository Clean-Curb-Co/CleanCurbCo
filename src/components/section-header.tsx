type SectionHeaderProps = {
  kicker?: string;
  title: string;
  children?: React.ReactNode;
  centered?: boolean;
};

export function SectionHeader({
  kicker,
  title,
  children,
  centered,
}: SectionHeaderProps) {
  return (
    <div className={`section-header${centered ? " centered" : ""}`}>
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}
