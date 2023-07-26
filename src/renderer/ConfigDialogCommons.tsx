import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import { IAppContext, useAppContext } from "../model/AppContext";
import { RendererConfig } from "./RendererConfig";

class ChatWidthSelectProps {
  width = 500;
}

export function setChatWidth(cfg: RendererConfig) {
  cfg.width = Number((document.getElementById("chat-width-select") as HTMLInputElement).value);
}

export function ChatWidthSelect(props: ChatWidthSelectProps) {
  const { t } = useTranslation();
  return MakeSelect(
    "chat-width",
    [500, 800, 1000],
    props.width,
    t("common-cfg-width"),
  );
}

export function updateAppConfig(ctx: IAppContext) {
  const cfg = { ...ctx.appConfig };
  cfg.maxWidth = (document.getElementById("app-width-select") as HTMLInputElement).value;
  ctx.setAppConfig(cfg);
}

export function AppConfigUI() {
  const { t } = useTranslation();
  const ctx = useAppContext();

  return (<>
    {MakeSelect(
      "app-width",
      ["100vw", "80vw", "800px", "1000px", "1200px"],
      ctx.appConfig.maxWidth,
      t("app-cfg-width"),
      [t("app-cfg-width-100vw"), t("app-cfg-width-80vw"), "800px", "1000px", "1200px"],
    )}
  </>);
}

export function MakeSelect(key: string, values: string[] | number[], defaultValue: string | number, label: string, valueLabels: null | string[] = null) {
  const actualValueLabels = valueLabels ?? values.map(v => `${v}`);

  return (
    <FormControl fullWidth>
      <InputLabel id={`${key}-label`}>{label}</InputLabel>
      <Select
        labelId={`${key}-label`}
        inputProps={{
          id: `${key}-select`
        }}
        defaultValue={defaultValue}
        label={label}
      >
        {
          values.map((v, i) => [v, actualValueLabels[i]]).map((tuple, i) => (
            <MenuItem key={i} value={tuple[0]}>{`${tuple[1]}`}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}
