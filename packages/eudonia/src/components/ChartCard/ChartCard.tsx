import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Card } from "../Card/Card";

import styles from "./ChartCard.module.css";

type DivProps = ComponentPropsWithoutRef<"div">;

export interface ChartCardProps extends Omit<DivProps, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  body?: ReactNode;
}

export function ChartCard({ title, subtitle, body, children, ...props }: ChartCardProps) {
  const content = body ?? children;
  return (
    <Card {...props}>
      {title !== undefined ? <Card.Title>{title}</Card.Title> : null}
      {subtitle !== undefined ? <Card.SubTitle>{subtitle}</Card.SubTitle> : null}
      {content !== undefined && content !== null ? (
        <div className={styles.body}>{content}</div>
      ) : null}
    </Card>
  );
}
