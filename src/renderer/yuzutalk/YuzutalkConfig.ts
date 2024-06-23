import { RendererConfig } from "../RendererConfig";

export default class YuzutalkConfig extends RendererConfig {
  theme = YuzutalkTheme.Yuzutalk;
  avatarBackground = YuzutalkAvatarBackground.Enabled;
}

export enum YuzutalkTheme {
  Yuzutalk = "Yuzutalk",
  Momotalk = "Momotalk",
}

export enum YuzutalkAvatarBackground {
  Enabled = "Enabled",
  Disabled = "Disabled",
}
