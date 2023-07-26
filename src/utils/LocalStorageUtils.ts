export function loadFromStorage<T extends {}>(defaultValue: T, key: string): T {
  return Object.assign(
    defaultValue,
    JSON.parse(localStorage.getItem(key) || "{}")
  );
}
