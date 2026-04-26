import { useState } from "react";

import { monochrome, PALETTE_NAMES, type PaletteName, type PaletteProp } from "eudonia/color";

const MONOCHROME_DEMO = "monochrome(oklch(0.5 0.25 261.56))";
const PICKER_OPTIONS = [...PALETTE_NAMES, MONOCHROME_DEMO] as const;

type PickerValue = (typeof PICKER_OPTIONS)[number];

type DevMenuProps = {
  onPaletteChange: (palette: PaletteProp) => void;
};

function resolvePalette(value: PickerValue): PaletteProp {
  if (value === MONOCHROME_DEMO) {
    return monochrome("oklch(0.5 0.25 261.56)");
  }

  return value as PaletteName;
}

function toggleTheme() {
  const el = document.documentElement;
  const current = el.dataset.theme;
  const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const effective = current ?? system;
  el.dataset.theme = effective === "dark" ? "light" : "dark";
}

export function DevMenu({ onPaletteChange }: DevMenuProps) {
  const [pickerValue, setPickerValue] = useState<PickerValue>("default");

  function handlePaletteChange(value: PickerValue) {
    setPickerValue(value);
    onPaletteChange(resolvePalette(value));
  }

  return (
    <div className="dev-controls">
      <select
        aria-label="Palette"
        className="palette-picker"
        onChange={(e) => handlePaletteChange(e.target.value as PickerValue)}
        value={pickerValue}
      >
        {PICKER_OPTIONS.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <button aria-label="Toggle theme" className="theme-toggle" onClick={toggleTheme} type="button">
        💡
      </button>
    </div>
  );
}
