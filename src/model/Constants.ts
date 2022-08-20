import CustomDataSource from "../data/CustomDataSource";
import IDataSource from "../data/IDataSource";
import RemoteDataSource from "../data/RemoteDataSource";
import { RendererType } from "../renderer/RendererType";

export const DataSources: IDataSource[] = [
  new RemoteDataSource("Arknights", "ak", "zh-cn"),
  new RemoteDataSource("Blue Archive", "ba", "ja"),

  // custom must be last source
  new CustomDataSource("Custom", "custom"),
];

export const Renderers = [
  RendererType.Arknights,
  RendererType.Yuzutalk,
];

export const Languages = [
  "zh-cn",
  "ja",
  "en",
  "zh-tw",
];
