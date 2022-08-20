import Character from "../model/Character";
import FilterGroup from "../model/FilterGroup";
import StampInfo from "../model/StampInfo";
import IDataSource from "./IDataSource";

export default abstract class BasicDataSource implements IDataSource {
  name: string;
  key: string;
  lang_fallback: string;

  constructor(name: string, key: string, lang_fallback: string) {
    this.name = name;
    this.key = key;
    this.lang_fallback = lang_fallback;
  }

  abstract get_characters(): Promise<Character[]>;
  abstract get_stamps(): Promise<StampInfo[]>;
  abstract get_avatar_url(img: string): string;
  abstract get_filters(): Promise<FilterGroup[]>;

  filter(char: Character, filters: FilterGroup[]): boolean {
    // keep char if char matches all groups with active filters
    for (const gp of filters) {
      if (!gp.active.some(v => v)) {
        continue;
      }

      // char matches group if char.searches contains at least one active filter
      if (!gp.filter_searches.some((v, i) => gp.active[i] && char.searches.includes(v))) {
        return false;
      }
    }

    return true;
  }

  get_string(map: Map<string, string>, lang: string): string {
    for (let key of [lang, this.lang_fallback]) {
      const s = map.get(key);
      if (s && s.length > 0) {
        return s;
      }
    }
    return "";
  }
}
