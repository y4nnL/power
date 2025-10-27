import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ title, description, actions, className, children }: CardProps) {
  return (
    <section className={twMerge("rounded-xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
      {(title || actions) && (
        <header className="mb-4 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="space-y-4 text-slate-700">{children}</div>
    </section>
  );
}
