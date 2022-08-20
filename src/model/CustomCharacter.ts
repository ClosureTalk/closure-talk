import IDataSource from "../data/IDataSource";
import { get_now_filename } from "../utils/DateUtils";
import Character from "./Character";

export default class CustomCharacter extends Character {
  image: string;

  constructor(ds: IDataSource, name: string, image: string) {
    super(ds);

    this.id = "custom-" + get_now_filename();
    this.names.set("zh-cn", name);
    this.short_names.set("zh-cn", name);
    this.image = image;
    this.images.push("uploaded");
  }

  get_url(img: string): string {
    return this.image;
  }

  static load_custom_object(object: any, ds: IDataSource): CustomCharacter {
    const ch = new CustomCharacter(
      ds,
      object.names["zh-cn"] as string,
      object.image as string
    );
    ch.id = object.id as string;
    ch.setup_search();
    return ch;
  }
}
