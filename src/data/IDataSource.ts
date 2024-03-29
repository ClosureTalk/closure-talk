import Character from "../model/Character";
import FilterGroup from "../model/FilterGroup";
import StampInfo from "../model/StampInfo";

export default interface IDataSource {
  key: string;
  name: string;

  get_characters(): Promise<Character[]>;
  get_stamps(): Promise<StampInfo[]>;
  get_avatar_url(img: string): string;
  get_string(map: Map<string, string>, lang: string): string;

  get_filters(): Promise<FilterGroup[]>;
  filter(char: Character, filters: FilterGroup[]): boolean;
}
