import type { ComponentPropsWithoutRef, CSSProperties } from "react";

import { resolvePalette } from "@/color/resolvePalette";
import type { PaletteProp } from "@/color/types";

import styles from "./Card.module.css";

type DivProps = ComponentPropsWithoutRef<"div">;

export interface CardRootProps extends DivProps {
  palette?: PaletteProp;
}

function CardRoot({
  children,
  className = "",
  palette,
  style,
  ...props
}: CardRootProps) {
  const { style: paletteStyle } = resolvePalette(palette);
  // Spread palette first so explicit `style` overrides win — the consumer's
  // inline tokens are the most specific intent.
  const mergedStyle: CSSProperties | undefined =
    paletteStyle === undefined && style === undefined
      ? undefined
      : { ...paletteStyle, ...style };
  return (
    <div
      {...props}
      className={`${styles.root} ${className}`}
      style={mergedStyle}
    >
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
