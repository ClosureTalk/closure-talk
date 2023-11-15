import Character from "../model/Character";
import CustomCharacter from "../model/CustomCharacter";
import FilterGroup from "../model/FilterGroup";
import StampInfo from "../model/StampInfo";
import BasicDataSource from "./BasicDataSource";
import localforage from "localforage";

export default class CustomDataSource extends BasicDataSource {
  characters: CustomCharacter[] = [];

  constructor(name: string, key: string) {
    super(name, key, "zh-cn");
  }

  get_custom_characters_store(): LocalForage {
    return localforage.createInstance({
      name: "custom_characters",
      driver: localforage.INDEXEDDB,
    });;
  }

  async get_characters(): Promise<Character[]> {
    let list_json = await this.get_custom_characters_store().getItem<string>('custom-characters');
    if (!list_json) {
      list_json = "[]";
    }

    const list = JSON.parse(list_json) as any[];
    this.characters = list.map(ch => CustomCharacter.load_custom_object(ch, this));
    return this.characters;
  }

  async get_stamps(): Promise<StampInfo[]> {
    return [];
  }

  get_avatar_url(img: string): string {
    throw new Error("Method not implemented.");
  }

  add_character(ch: CustomCharacter) {
    this.characters.push(ch);
    this.update_storage();
  }

  remove_character(ch: CustomCharacter) {
    this.characters = this.characters.filter(c => c !== ch);
    this.update_storage();
  }

  update_storage(): Promise<string> {
    const chars = this.characters.map(ch => {
      return {
        names: Object.fromEntries(ch.names),
        image: ch.image,
        id: ch.id
      };
    });

    return this.get_custom_characters_store().setItem('custom-characters', JSON.stringify(chars))
  }

  async get_filters(): Promise<FilterGroup[]> {
    return [];
  }
}
