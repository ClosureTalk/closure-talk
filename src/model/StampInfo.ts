import IDataSource from "../data/IDataSource";

export default class StampInfo {
  key: string;
  url: string;
  ds: IDataSource;

  constructor(key: string, url: string, ds: IDataSource) {
    this.key = key;
    this.url = url;
    this.ds = ds;
  }
}
