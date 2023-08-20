import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../model/AppContext";
import { getCustomDataSource } from "../model/Constants";
import CustomCharacter from "../model/CustomCharacter";

class RemoveCustomCharDialogProps {
  char: CustomCharacter | null = null;
  setClose = () => { };
}

export default function RemoveCustomCharDialog(props: RemoveCustomCharDialogProps) {
  const ctx = useAppContext();
  const { t } = useTranslation();

  return (
    <Dialog
      open={props.char !== null}
      onClose={props.setClose}
    >
      <DialogTitle>{t("remove-custom-char-confirm-title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("remove-custom-char-confirm-text")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.setClose}>{t("remove-custom-char-confirm-cancel")}</Button>
        <Button color="warning" onClick={() => {
          const char = props.char!;
          const ds = getCustomDataSource();
          ds.remove_character(char);

          const chars = new Map(ctx.characters);
          chars.delete(char.id);
          ctx.setCharacters(chars);

          props.setClose();
        }}>{t("remove-custom-char-confirm-yes")}</Button>
      </DialogActions>
    </Dialog>
  );
}
