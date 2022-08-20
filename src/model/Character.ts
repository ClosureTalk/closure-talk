import IDataSource from "../data/IDataSource";

export default class Character {
  id = "";
  names = new Map<string, string>();
  short_names = new Map<string, string>();
  images = new Array<string>();
  searches = new Array<string>();
  all_search = "";
  ds: IDataSource;

  constructor(ds: IDataSource) {
    this.ds = ds;
  }

  setup_search() {
    this.all_search = ([
      Array.from(this.names.values()).join("|"),
      Array.from(this.short_names.values()).join("|"),
      this.searches.join("|"),
    ].join("|")).toLowerCase();
  }

  get_url(img: string): string {
    return this.ds.get_avatar_url(img);
  }

  get_name(lang: string): string {
    return this.ds.get_string(this.names, lang);
  }

  get_short_name(lang: string): string {
    return this.ds.get_string(this.short_names, lang);
  }

  is_custom(): boolean {
    return this.id.startsWith("custom-");
  }

  static load_object(object: any, id_prefix: string, ds: IDataSource): Character {
    const ch = new Character(ds);
    Object.assign(ch, object);
    ch.id = id_prefix + ch.id;
    ch.names = new Map(Object.entries(object.names));
    ch.short_names = new Map(Object.entries(object.short_names));
    ch.setup_search();
    return ch;
  }
}
