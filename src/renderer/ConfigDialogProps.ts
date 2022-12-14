import { RendererConfig } from "./RendererConfig";
import { RendererType } from "./RendererType";

export default class ConfigDialogProps {
  open = false;
  setClose = () => { };
  setConfig = (name: RendererType, value: RendererConfig) => { };
}
