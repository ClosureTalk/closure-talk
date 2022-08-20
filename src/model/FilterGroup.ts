export default class FilterGroup {
  group_key: string;
  group_name: Map<string, string>;
  filter_searches: string[];
  filter_names: Map<string, string>[];
  active: boolean[];

  constructor(
    group_key: string,
    group_name: Map<string, string>,
    filter_searches: string[],
    filter_names: Map<string, string>[],
    active: boolean[] | null = null,
  ) {
    this.group_key = group_key;
    this.group_name = group_name;
    this.filter_searches = filter_searches;
    this.filter_names = filter_names;
    this.active = active || filter_names.map(() => { return false; });
  }

  static load_object(object: any): FilterGroup {
    return new FilterGroup(
      object.group_key,
      new Map(Object.entries(object.group_name)),
      object.filter_searches,
      object.filter_names.map((obj: any) => new Map(Object.entries(obj))),
      object.active,
    );
  }
}
