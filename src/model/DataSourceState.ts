import IDataSource from "../data/IDataSource";
import FilterGroup from "./FilterGroup";

export default class DataSourceState {
  source: IDataSource;
  enabled = true;
  filters: FilterGroup[];

  constructor(source: IDataSource, filters: FilterGroup[]) {
    this.source = source;
    this.filters = filters;
  }

  load_state() {
    const data = localStorage.getItem(`ds_state_${this.source.key}`) || "";
    if (data.length === 0) {
      return;
    }

    const state = JSON.parse(data);
    this.enabled = state.enabled;
    for (let filter of this.filters) {
      const active = state.active[filter.group_key] as boolean[];
      if (!active || active.length !== filter.active.length) {
        continue;
      }
      filter.active = active;
    }
  }

  save_state() {
    const active = new Map<string, boolean[]>();
    for (let filter of this.filters) {
      active.set(filter.group_key, filter.active);
    }

    localStorage.setItem(`ds_state_${this.source.key}`, JSON.stringify({
      "enabled": this.enabled,
      "active": Object.fromEntries(active),
    }));
  }
}
