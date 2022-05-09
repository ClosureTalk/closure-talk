export function get_key_string(ev: KeyboardEvent): string {
  const names = ["Meta", "Control", "Alt", "Shift"];
  const flags = [ev.metaKey, ev.ctrlKey, ev.altKey, ev.shiftKey];

  const keys = names.filter((_, idx) => flags[idx]);
  if (!names.includes(ev.key)) {
    keys.push(ev.key);
  }
  return keys.join("+");
}
