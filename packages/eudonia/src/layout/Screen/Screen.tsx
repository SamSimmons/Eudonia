import type { ComponentPropsWithoutRef } from "react";

import { resolvePalette } from "@/color/resolvePalette";
import type { PaletteProp } from "@/color/types";

const css = `.eudonia-screen{height:100vh;height:100dvh;background:var(--eudonia-bg);font-feature-settings:"calt","ss02","zero","tnum";font-variant-numeric:tabular-nums lining-nums;font-optical-sizing:auto;font-synthesis:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}`;

interface ScreenProps extends ComponentPropsWithoutRef<"div"> {
  palette?: PaletteProp;
}

export function Screen({
  children,
  className = "",
  palette,
  style,
  ...props
}: ScreenProps) {
  const { style: paletteStyle } = resolvePalette(palette);
  return (
    <>
      <style href="eudonia-screen" precedence="eudonia">{css}</style>
      <div
        {...props}
        className={`eudonia-screen ${className}`}
        style={{
          ...paletteStyle,
          ...style,
          width: "100%",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </>
  );
}
