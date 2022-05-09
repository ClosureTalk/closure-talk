import Character from "./Character";
import { DataSources } from "./Constants";
import StampInfo from "./StampInfo";

export default class AppData {
  characters = new Map<string, Character>();
  ordered_characters: Character[] = [];
  stamps: StampInfo[][] = [];

  static async load_data(): Promise<AppData> {
    const data = new AppData();

    for (let ds of DataSources) {
      const list = await ds.get_characters();

      list.forEach(ch => {
        data.ordered_characters.push(ch);
        data.characters.set(ch.id, ch);
      });
      const stamps = await ds.get_stamps();
      if (stamps.length > 0) {
        data.stamps.push(stamps);
      }
    }
    return data;
  }
}
