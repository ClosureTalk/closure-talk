import { Button, DialogActions, Stack } from "@mui/material";
import EditDialogProps from "./EditDialogProps";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../model/AppContext";

class EditDialogActionsProps {
  editDialogProps = new EditDialogProps();
  onApply = () => { };
  onCancel = () => { };
}

export default function EditDialogActions(props: EditDialogActionsProps) {
  const ctx = useAppContext();
  const dialogProps = props.editDialogProps;
  const { t } = useTranslation();
  const setEditIdx = (delta: number) => {
    if (!dialogProps.editing) {
      return;
    }
    const idx = dialogProps.chat.indexOf(dialogProps.editing);
    dialogProps.setInsertIdx(idx + delta);
  };

  return (
    <DialogActions>
      <Stack direction="column" width="100%" spacing={2}>
        {ctx.isWideScreen ? null :
          <Stack
            width="100%"
            direction="row"
            justifyContent="space-between"
          >
            <Button onClick={() => setEditIdx(0)}>{t("chat-edit-insert-before")}</Button>
            <Button onClick={() => setEditIdx(1)}>{t("chat-edit-insert-after")}</Button>
          </Stack>
        }
        <Stack
          width="100%"
          direction="row"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
          >
            <Button color="error" onClick={() => {
              dialogProps.setChat(dialogProps.chat.filter(ch => ch !== dialogProps.editing));
              dialogProps.setEditingNull();
            }}>{t("chat-edit-delete")}</Button>
          </Stack>
          <Stack
            direction="row"
          >
            <Button color="inherit" onClick={() => {
              props.onCancel();
              dialogProps.setEditingNull();
            }}>{t("chat-edit-cancel")}</Button>
            <Button color="primary" onClick={() => {
              props.onApply();
              dialogProps.setEditingNull();
            }}>{t("chat-edit-apply")}</Button>
          </Stack>
        </Stack>
      </Stack>
    </DialogActions>
  );
}
