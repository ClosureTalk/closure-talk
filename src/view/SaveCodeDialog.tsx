import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../model/AppContext";
import Character from "../model/Character";
import { getCustomDataSource } from "../model/Constants";
import { serialize_chat } from "../utils/ChatUtils";
import { get_now_filename } from "../utils/DateUtils";
import { download_text } from "../utils/DownloadUtils";
import { getRadioGroupValue, isChecked } from "../utils/HtmlUtils";

class SaveCodeDialogProps {
  closeDialog = () => { };
}

export default function SaveCodeDialog(props: SaveCodeDialogProps) {
  const { t } = useTranslation();
  const ctx = useAppContext();

  const saveAndClose = () => {
    localStorage.setItem("save-code-save-chat", isChecked("save-code-save-chat-chkbox").toString());
    localStorage.setItem("save-code-save-char", isChecked("save-code-save-char-chkbox").toString());
    localStorage.setItem("save-code-custom-chars", getRadioGroupValue("save-code-custom-chars"));
    props.closeDialog();
  };

  return (
    <Dialog
      open={true}
      onClose={saveAndClose}
      maxWidth="sm"
    >
      <DialogTitle>{t("save-code-dialog-title")}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth size="small">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox
                id="save-code-save-chat-chkbox"
                defaultChecked={localStorage.getItem("save-code-save-chat") !== "false"} />}
              label={t("save-code-dialog-save-chat")} />
            <FormControlLabel
              control={<Checkbox
                id="save-code-save-char-chkbox"
                defaultChecked={localStorage.getItem("save-code-save-char") !== "false"} />}
              label={t("save-code-dialog-save-active-chars")} />
          </FormGroup>
          <RadioGroup
            name="save-code-custom-chars"
            defaultValue={localStorage.getItem("save-code-custom-chars") || "save-used-custom-chars"}
          >
            <FormControlLabel value="no-save-custom-chars" control={<Radio />}
              label={t("save-code-dialog-no-save-custom-chars")} />
            <FormControlLabel value="save-used-custom-chars" control={<Radio />}
              label={t("save-code-dialog-save-used-custom-chars")} />
            <FormControlLabel value="save-active-custom-chars" control={<Radio />}
              label={t("save-code-dialog-save-active-custom-chars")} />
            <FormControlLabel value="save-all-custom-chars" control={<Radio />}
              label={t("save-code-dialog-save-all-custom-chars")} />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Stack
          width="100%"
          direction="row"
          justifyContent="space-between"
        >
          <Button color="error" onClick={saveAndClose}>{t("save-code-dialog-cancel")}</Button>
          <Button color="primary" onClick={async () => {
            let customChars: Character[] | null = null;

            switch (getRadioGroupValue("save-code-custom-chars")) {
              case "save-used-custom-chars":
                customChars = (await getCustomDataSource().get_characters()).filter(ch => ctx.chat.some(item => item.char?.character.id === ch.id));
                break;
              case "save-active-custom-chars":
                customChars = (await getCustomDataSource().get_characters()).filter(ch => ctx.activeChars.some(activeCh => activeCh.character.id === ch.id));
                break;
              case "save-all-custom-chars":
                customChars = await getCustomDataSource().get_characters();
                break;
            }

            const serializedStr = serialize_chat(
              isChecked("save-code-save-chat-chkbox") ? ctx.chat : null,
              isChecked("save-code-save-char-chkbox") ? ctx.activeChars : null,
              customChars,
            );

            download_text(serializedStr, `closure-talk-${get_now_filename()}.json`);
            saveAndClose();
          }}>{t("save-code-dialog-save")}</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
