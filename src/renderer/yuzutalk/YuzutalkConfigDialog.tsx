import { Dialog, DialogContent, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../model/AppContext";
import { getConfig } from "../../utils/CtxUtils";
import { AppConfigUI, ChatWidthSelect, MakeSelect, setChatWidth, updateAppConfig } from "../ConfigDialogCommons";
import ConfigDialogProps from "../ConfigDialogProps";
import { RendererType } from "../RendererType";
import YuzutalkConfig, { YuzutalkAvatarBackground, YuzutalkTheme } from "./YuzutalkConfig";

export default function YuzutalkConfigDialog(props: ConfigDialogProps) {
  const ctx = useAppContext();
  const config = getConfig(YuzutalkConfig, ctx, RendererType.Yuzutalk);
  const { t } = useTranslation();
  const [avatarBackground, setAvatarBackground] = useState(config.avatarBackground);

  return !props.open ? null : (
    <Dialog
      open={true}
      onClose={() => {
        updateAppConfig(ctx);

        const cfg = new YuzutalkConfig();
        setChatWidth(cfg);
        cfg.theme = (document.getElementById("yuzu-theme-select") as HTMLInputElement).value as YuzutalkTheme;
        cfg.avatarBackground = avatarBackground;
        props.setClose();
        props.setConfig(RendererType.Yuzutalk, cfg);
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <AppConfigUI />
        <ChatWidthSelect width={config.width} />
        {MakeSelect(
          "yuzu-theme",
          [YuzutalkTheme.Yuzutalk, YuzutalkTheme.Momotalk],
          config.theme,
          t("yuzu-theme"),
        )}
        <FormGroup>
          <FormControlLabel control={
            <Switch
              checked={avatarBackground === YuzutalkAvatarBackground.Enabled}
              onChange={() => setAvatarBackground(avatarBackground === YuzutalkAvatarBackground.Enabled ? YuzutalkAvatarBackground.Disabled : YuzutalkAvatarBackground.Enabled)}
            />
          } label={t("yuzu-background-avatar")} />
        </FormGroup>
      </DialogContent>
    </Dialog>
  );
}
