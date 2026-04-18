import type { ComponentPropsWithoutRef } from "react";

import styles from "./Card.module.css";

type DivProps = ComponentPropsWithoutRef<"div">;

function CardRoot({ children, className = "", ...props }: DivProps) {
  return (
    <div {...props} className={`${styles.root} ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = "", ...props }: DivProps) {
  return (
    <div {...props} className={`${styles.title} ${className}`}>
      {children}
    </div>
  );
}

function CardSubTitle({ children, className = "", ...props }: DivProps) {
  return (
    <div {...props} className={`${styles.subtitle} ${className}`}>
      {children}
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Title: CardTitle,
  SubTitle: CardSubTitle,
});
