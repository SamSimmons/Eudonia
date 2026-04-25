export function CaretIcon({
  direction,
  variant,
  className = "",
}: {
  direction: "up" | "down";
  variant: "current" | "preview";
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      data-sort-icon={variant}
    >
      <path
        d={direction === "down" ? "M1 3.5 L9 3.5 L5 7.5 Z" : "M5 2.5 L9 6.5 L1 6.5 Z"}
      />
    </svg>
  );
}
