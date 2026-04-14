import type { ComponentPropsWithoutRef } from "react";

const css = `.eudonia-screen{height:100vh;height:100dvh}`;

type ScreenProps = ComponentPropsWithoutRef<"div">;

export function Screen({
  children,
  className = "",
  style,
  ...props
}: ScreenProps) {
  return (
    <>
      <style href="eudonia-screen" precedence="eudonia">{css}</style>
      <div
        {...props}
        className={`eudonia-screen ${className}`}
        style={{ ...style, width: "100%", overflow: "hidden" }}
      >
        {children}
      </div>
    </>
  );
}
