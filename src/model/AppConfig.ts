import { loadFromStorage } from "../utils/LocalStorageUtils";

const localStorageKey = "appConfig";

export default class AppConfig {
  maxWidth = "100vw";
}

export function loadAppConfig(): AppConfig {
  return loadFromStorage(new AppConfig(), localStorageKey);
}

export function saveAppConfig(config: AppConfig) {
  localStorage.setItem(localStorageKey, JSON.stringify(config));
}
