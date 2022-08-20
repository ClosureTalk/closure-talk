import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomDataSource from "../data/CustomDataSource";
import { useAppContext } from "../model/AppContext";
import { DataSources } from "../model/Constants";
import CustomCharacter from "../model/CustomCharacter";

class RemoveCustomCharDialogProps {
  char: CustomCharacter | null = null
  setClose = () => {}
}

export default function RemoveCustomCharDialog(props: RemoveCustomCharDialogProps) {
  const ctx = useAppContext();
  const { t } = useTranslation();

  return (
    <Dialog
    open={props.char !== null}
    onClose={props.setClose}
  >
    <DialogTitle>{t("Remove custom char confirm title")}</DialogTitle>
    <DialogContent>
      <DialogContentText>{t("Remove custom char confirm text")}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.setClose}>{t("Cancel")}</Button>
      <Button color="warning" onClick={() => {
        const char = props.char!;
        const ds = DataSources[DataSources.length - 1] as CustomDataSource;
        ds.remove_character(char);

        const chars = new Map(ctx.characters);
        chars.delete(char.id);
        ctx.setCharacters(chars);

        props.setClose();
      }}>{t("Yes")}</Button>
    </DialogActions>
  </Dialog>
  )
}
