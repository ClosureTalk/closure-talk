import Character from "../model/Character";
import StampInfo from "../model/StampInfo";
import IDataSource from "./IDataSource";

export default class RemoteDataSource implements IDataSource {
  name: string;
  key: string;
  lang_fallback: string;

  constructor(name: string, key: string, lang_fallback: string) {
    this.name = name;
    this.key = key;
    this.lang_fallback = lang_fallback;
  }

  id_prefix(): string {
    return this.key + "-";
  }

  async get_characters(): Promise<Character[]> {
    const list = await (await fetch(`resources/${this.key}/char.json`)).json() as any[];
    return list.map(obj => Character.load_object(obj, this.id_prefix(), this));
  }

  async get_stamps(): Promise<StampInfo[]> {
    const list = await (await fetch(`resources/${this.key}/stamps.json`)).json() as string[];
    return list.map(s => new StampInfo(
      this.id_prefix() + s,
      `resources/${this.key}/stamps/${encodeURIComponent(s)}.webp`,
      this
    ));
  }

  get_avatar_url(img: string): string {
    return `resources/${this.key}/characters/${encodeURIComponent(img)}.webp`;
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
