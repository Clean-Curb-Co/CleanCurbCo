import type { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  dark?: boolean;
};

export function ServiceCard({
  title,
  description,
  icon: Icon,
  dark,
}: ServiceCardProps) {
  return (
    <article className={`card${dark ? " dark-card" : ""}`}>
      <span className="icon-box">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
