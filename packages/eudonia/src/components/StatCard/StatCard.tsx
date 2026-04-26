import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Card, type CardRootProps } from "../Card/Card";
import { Sparkline, type SparklineProps } from "../Sparkline/Sparkline";

import styles from "./StatCard.module.css";

type DivProps = ComponentPropsWithoutRef<"div">;

interface StatCardRootProps extends Omit<CardRootProps, "title"> {
  title?: ReactNode;
  value?: ReactNode;
}

function StatCardRoot({ children, title, value, ...props }: StatCardRootProps) {
  return (
    <Card {...props}>
      {title !== undefined ? <Card.Title>{title}</Card.Title> : null}
      {value !== undefined ? (
        <StatCardBody>
          <StatCardValue>{value}</StatCardValue>
        </StatCardBody>
      ) : null}
      {children}
    </Card>
  );
}

function StatCardBody({ children, className = "", ...props }: DivProps) {
  return (
    <div {...props} className={`${styles.body} ${className}`}>
      {children}
    </div>
  );
}

function StatCardStack({ children, className = "", ...props }: DivProps) {
  return (
    <div {...props} className={`${styles.stack} ${className}`}>
      {children}
    </div>
  );
}

function StatCardSplit({ children, className = "", ...props }: DivProps) {
  return (
    <div {...props} className={`${styles.split} ${className}`}>
      {children}
    </div>
  );
}

function StatCardValue({ children, className = "", ...props }: DivProps) {
  return (
    <div {...props} className={`${styles.value} ${className}`}>
      {children}
    </div>
  );
}

function StatCardSparkline({ className = "", stroke, ...props }: SparklineProps) {
  // StatCard pairs a single large value with a quiet trend chart, so the
  // sparkline tracks the card foreground rather than the chart palette.
  // Consumer-passed `stroke` still wins.
  return (
    <Sparkline
      {...props}
      stroke={stroke ?? "var(--eudonia-card-fg)"}
      className={`${styles.sparkline} ${className}`}
    />
  );
}

export const StatCard = Object.assign(StatCardRoot, {
  Title: Card.Title,
  Body: StatCardBody,
  Stack: StatCardStack,
  Split: StatCardSplit,
  Value: StatCardValue,
  Sparkline: StatCardSparkline,
});
