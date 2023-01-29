import { Dialog, DialogContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../model/AppContext";
import { getConfig } from "../../utils/CtxUtils";
import { ChatWidthSelect, MakeSelect, setChatWidth } from "../ConfigDialogCommons";
import ConfigDialogProps from "../ConfigDialogProps";
import { RendererType } from "../RendererType";
import YuzutalkConfig, { YuzutalkTheme } from "./YuzutalkConfig";

export default function YuzutalkConfigDialog(props: ConfigDialogProps) {
  const ctx = useAppContext();
  const config = getConfig(YuzutalkConfig, ctx, RendererType.Yuzutalk);
  const { t } = useTranslation();

  return !props.open ? null : (
    <Dialog
      open={true}
      onClose={() => {
        const cfg = new YuzutalkConfig();
        setChatWidth(cfg);
        cfg.theme = (document.getElementById("yuzu-theme-select") as HTMLInputElement).value as YuzutalkTheme;
        props.setClose();
        props.setConfig(RendererType.Yuzutalk, cfg);
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <ChatWidthSelect width={config.width} />
        {MakeSelect(
          "yuzu-theme",
          [YuzutalkTheme.Yuzutalk, YuzutalkTheme.Momotalk],
          config.theme,
          t("yuzu-theme"),
        )}
      </DialogContent>
    </Dialog>
  );
}
