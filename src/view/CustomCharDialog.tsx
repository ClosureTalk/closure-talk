import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomDataSource from "../data/CustomDataSource";
import { useAppContext } from "../model/AppContext";
import ChatChar from "../model/ChatChar";
import { DataSources } from "../model/Constants";
import CustomCharacter from "../model/CustomCharacter";
import { prompt_file, read_file_as_url } from "../utils/FileUtils";

class CustomCharDialogProps {
  open = false;
  setClose = () => { };
}

export default function CustomCharDialog(props: CustomCharDialogProps) {
  const ctx = useAppContext();
  const { t } = useTranslation();

  const createChar = async () => {
    const name = (document.getElementById("custom-char-name") as HTMLInputElement).value.trim();
    if (name.length === 0) {
      return;
    }

    const file = await prompt_file("image/*");
    if (file === null) {
      return;
    }
    const image = await read_file_as_url(file);

    // save data
    const ds = DataSources[DataSources.length - 1] as CustomDataSource;
    const char = new CustomCharacter(ds, name, image);
    ds.add_character(char);

    // add to current context
    const chars = new Map(ctx.characters);
    chars.set(char.id, char);
    ctx.setCharacters(chars);
    ctx.setActiveChars([...ctx.activeChars, new ChatChar(char, "uploaded")]);
    props.setClose();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.setClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t("custom-char-title")}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="custom-char-name"
          label={t("custom-char-name")}
          fullWidth
          variant="standard"
          defaultValue=""
          onFocus={ev => ev.target.select()}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={createChar}>{t("custom-char-create")}</Button>
      </DialogActions>
    </Dialog>
  );
}
