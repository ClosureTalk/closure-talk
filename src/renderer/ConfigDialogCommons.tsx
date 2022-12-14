import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import { RendererConfig } from "./RendererConfig";

class ChatWidthSelectProps {
  width = 500;
}

export function setChatWidth(cfg: RendererConfig) {
  cfg.width = Number((document.getElementById("chat-width-select") as HTMLInputElement).value);
}

export function ChatWidthSelect(props: ChatWidthSelectProps) {
  const { t } = useTranslation();

  return (
    <FormControl fullWidth>
      <InputLabel id="chat-width-label">{t("common-cfg-width")}</InputLabel>
      <Select
        labelId="chat-width-label"
        inputProps={{
          id: "chat-width-select"
        }}
        defaultValue={props.width}
        label={t("common-cfg-width")}
      >
        <MenuItem value={500}>500</MenuItem>
        <MenuItem value={800}>800</MenuItem>
        <MenuItem value={1000}>1000</MenuItem>
      </Select>
    </FormControl>
  );
}
