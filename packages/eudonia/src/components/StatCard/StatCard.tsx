import type { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./StatCard.module.css";

type DivProps = ComponentPropsWithoutRef<"div">;

interface StatCardRootProps extends Omit<DivProps, "title"> {
  title?: ReactNode;
  value?: ReactNode;
}

function StatCardRoot({ children, className, title, value, ...props }: StatCardRootProps) {
  return (
    <div {...props} className={[styles.root, className].filter(Boolean).join(" ")}>
      {title !== undefined ? <StatCardTitle>{title}</StatCardTitle> : null}
      {value !== undefined ? <StatCardValue>{value}</StatCardValue> : null}
      {children}
    </div>
  );
}

function StatCardTitle({ children, className, ...props }: DivProps) {
  return (
    <div {...props} className={[styles.title, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

function StatCardValue({ children, className, ...props }: DivProps) {
  return (
    <div {...props} className={[styles.value, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export const StatCard = Object.assign(StatCardRoot, {
  Title: StatCardTitle,
  Value: StatCardValue,
});
