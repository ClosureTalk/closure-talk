import Character from "../model/Character";
import CustomCharacter from "../model/CustomCharacter";
import StampInfo from "../model/StampInfo";
import BasicDataSource from "./BasicDataSource";

export default class CustomDataSource extends BasicDataSource {
  characters: CustomCharacter[] = [];

  constructor(name: string, key: string) {
    super(name, key, "zh-cn");
  }

  async get_characters(): Promise<Character[]> {
    const list = JSON.parse(localStorage.getItem("custom-characters") || "[]") as any[];
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

  update_storage() {
    const chars = this.characters.map(ch => {
      return {
        names: Object.fromEntries(ch.names),
        image: ch.image,
        id: ch.id
      };
    });
    localStorage.setItem("custom-characters", JSON.stringify(chars));
  }
}
