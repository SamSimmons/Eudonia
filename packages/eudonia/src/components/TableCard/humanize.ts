// Splits camelCase, snake_case, and kebab-case into title-cased words.
// All-caps tokens (acronyms like "USD", "MI-72", "API") are preserved verbatim
// so users don't see "Usd" or "Mi 72" — anything that already contains a
// lowercase letter is title-cased the usual way.
export function humanizeKey(key: string): string {
  if (key.length === 0) return key;
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/);
  return words.map(humanizeWord).join(" ");
}

function humanizeWord(word: string): string {
  if (word.length === 0) return word;
  if (!/[a-z]/.test(word)) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
