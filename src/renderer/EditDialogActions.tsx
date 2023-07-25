import { Button, DialogActions, Stack } from "@mui/material";
import EditDialogProps from "./EditDialogProps";
import { useTranslation } from "react-i18next";

class EditDialogActionsProps {
  editDialogProps = new EditDialogProps();
  onApply = () => { };
  onCancel = () => { };
}

export default function EditDialogActions(props: EditDialogActionsProps) {
  const dialogProps = props.editDialogProps;
  const { t } = useTranslation();

  return (
    <DialogActions>
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
            dialogProps.setInsertIdx(-1);
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
    </DialogActions>
  );
}
