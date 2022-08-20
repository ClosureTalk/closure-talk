import Character from "../model/Character";
import FilterGroup from "../model/FilterGroup";
import StampInfo from "../model/StampInfo";
import BasicDataSource from "./BasicDataSource";

export default class RemoteDataSource extends BasicDataSource {
  constructor(name: string, key: string, lang_fallback: string) {
    super(name, key, lang_fallback);
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

  async get_filters(): Promise<FilterGroup[]> {
    const list = await (await fetch(`resources/${this.key}/filters.json`)).json() as any[];
    return list.map(obj => FilterGroup.load_object(obj));
  }

  get_avatar_url(img: string): string {
    return `resources/${this.key}/characters/${encodeURIComponent(img)}.webp`;
  }
}
