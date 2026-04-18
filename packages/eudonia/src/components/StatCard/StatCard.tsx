import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Card } from "../Card/Card";

import styles from "./StatCard.module.css";

type DivProps = ComponentPropsWithoutRef<"div">;

interface StatCardRootProps extends Omit<DivProps, "title"> {
  title?: ReactNode;
  value?: ReactNode;
}

function StatCardRoot({ children, title, value, ...props }: StatCardRootProps) {
  return (
    <Card {...props}>
      {title !== undefined ? <Card.Title>{title}</Card.Title> : null}
      {value !== undefined ? <StatCardValue>{value}</StatCardValue> : null}
      {children}
    </Card>
  );
}

function StatCardValue({ children, className = "", ...props }: DivProps) {
  return (
    <div {...props} className={`${styles.value} ${className}`}>
      {children}
    </div>
  );
}

export const StatCard = Object.assign(StatCardRoot, {
  Title: Card.Title,
  Value: StatCardValue,
});
