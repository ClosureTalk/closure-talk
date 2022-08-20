import Character from "../model/Character";
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
