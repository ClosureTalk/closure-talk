import { RendererConfig } from "../RendererConfig";

export default class YuzutalkConfig extends RendererConfig {
  theme = YuzutalkTheme.Yuzutalk;
}

export enum YuzutalkTheme {
  Yuzutalk = "Yuzutalk",
  Momotalk = "Momotalk",
}
