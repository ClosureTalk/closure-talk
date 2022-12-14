import { Dialog, DialogContent } from "@mui/material";
import { useAppContext } from "../../model/AppContext";
import { getConfig } from "../../utils/CtxUtils";
import { ChatWidthSelect, setChatWidth } from "../ConfigDialogCommons";
import ConfigDialogProps from "../ConfigDialogProps";
import { RendererType } from "../RendererType";
import ArknightsConfig from "./ArknightsConfig";

export default function ArknightsConfigDialog(props: ConfigDialogProps) {
  const ctx = useAppContext();
  const config = getConfig(ArknightsConfig, ctx, RendererType.Arknights);

  return !props.open ? null : (
    <Dialog
      open={true}
      onClose={() => {
        const cfg = new ArknightsConfig();
        setChatWidth(cfg);
        props.setClose();
        props.setConfig(RendererType.Arknights, cfg);
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <ChatWidthSelect width={config.width} />
      </DialogContent>
    </Dialog>
  );
}
