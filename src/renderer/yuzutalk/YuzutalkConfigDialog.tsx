import { Dialog, DialogContent } from "@mui/material";
import { useAppContext } from "../../model/AppContext";
import { getConfig } from "../../utils/CtxUtils";
import { ChatWidthSelect, setChatWidth } from "../ConfigDialogCommons";
import ConfigDialogProps from "../ConfigDialogProps";
import { RendererType } from "../RendererType";
import YuzutalkConfig from "./YuzutalkConfig";

export default function YuzutalkConfigDialog(props: ConfigDialogProps) {
  const ctx = useAppContext();
  const config = getConfig(YuzutalkConfig, ctx, RendererType.Yuzutalk);

  return !props.open ? null : (
    <Dialog
      open={true}
      onClose={() => {
        const cfg = new YuzutalkConfig();
        setChatWidth(cfg);
        props.setClose();
        props.setConfig(RendererType.Yuzutalk, cfg);
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
