import type { ReactNode } from "react";

import { Card, type CardRootProps } from "../Card/Card";

import styles from "./ChartCard.module.css";

export interface ChartCardProps extends Omit<CardRootProps, "title"> {
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
