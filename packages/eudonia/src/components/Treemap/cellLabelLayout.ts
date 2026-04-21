import { truncateText } from "../Chart/textMetrics";

const LABEL_FONT = '12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const LABEL_PADDING_X = 6;
const LABEL_PADDING_Y = 4;
const LABEL_LINE_HEIGHT = 14;
// Vertical offset to the text baseline — the font's ~3px descender means the
// visible glyphs sit `LINE_HEIGHT - 3` below the top of the line box.
const BASELINE_OFFSET = 3;

interface PlanArgs {
  width: number;
  height: number;
  label: string;
  value: string | null;
  labelSkipSize: number;
}

interface PlacedText {
  text: string;
  x: number;
  y: number;
}

export interface CellLabelPlan {
  label: PlacedText | null;
  value: PlacedText | null;
}

// Decides whether the label and (optional) value line fit inside a cell of
// the given dimensions, and where each should sit. Pure — lives outside the
// component so it's testable and keeps the render function thin.
export function planCellLabels({
  width,
  height,
  label,
  value,
  labelSkipSize,
}: PlanArgs): CellLabelPlan {
  const smaller = Math.min(width, height);
  if (smaller < labelSkipSize) return { label: null, value: null };

  const availableWidth = Math.max(0, width - LABEL_PADDING_X * 2);
  const labelText = truncateText(label, LABEL_FONT, availableWidth);
  if (!labelText) return { label: null, value: null };

  const placedLabel: PlacedText = {
    text: labelText,
    x: LABEL_PADDING_X,
    y: LABEL_PADDING_Y + LABEL_LINE_HEIGHT - BASELINE_OFFSET,
  };

  const canFitValue =
    value !== null && height >= LABEL_LINE_HEIGHT * 2 + LABEL_PADDING_Y;
  if (!canFitValue) return { label: placedLabel, value: null };

  const valueText = truncateText(value, LABEL_FONT, availableWidth);
  if (!valueText) return { label: placedLabel, value: null };

  return {
    label: placedLabel,
    value: {
      text: valueText,
      x: LABEL_PADDING_X,
      y: LABEL_PADDING_Y + LABEL_LINE_HEIGHT * 2 - BASELINE_OFFSET,
    },
  };
}
