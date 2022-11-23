import { Button, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { YuzutalkChatItemAvatarState, YuzutalkChatItemType } from "../../model/props/YuzutalkProps";
import EditDialogProps from "../EditDialogProps";

export default function YuzutalkEditDialog(props: EditDialogProps) {
  const editing = props.editing;
  const chat = props.chat;
  const { t } = useTranslation();
  const editable = editing !== null && editing.yuzutalk.type !== YuzutalkChatItemType.Image;

  return editing === null ? <></> : (
    <Dialog
      open={true}
      onClose={() => {
        const item = editing!;

        const getElement = (id: string) => document.getElementById(id) as HTMLInputElement;
        if (editable) {
          item.content = getElement("edit-content").value;
          console.log(getElement("item-type-select").value);
          item.yuzutalk.type = getElement("item-type-select").value as YuzutalkChatItemType;
        }

        item.yuzutalk.avatarState = getElement("edit-avatar").checked ? YuzutalkChatItemAvatarState.Show : YuzutalkChatItemAvatarState.Auto;
        item.yuzutalk.nameOverride = getElement("name-override").value.trim();

        props.setChat([...chat]);
        props.setEditingNull();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="edit-content"
          label={t("chat-edit-content")}
          fullWidth
          multiline
          variant="standard"
          defaultValue={editable ? editing.content : ""}
          onFocus={ev => ev.target.select()}
          disabled={!editable}
        />
        <TextField
          margin="dense"
          id="name-override"
          label={t("chat-edit-name-override")}
          fullWidth
          variant="standard"
          defaultValue={editing.yuzutalk.nameOverride}
          onFocus={ev => ev.target.select()}
        />
        <FormGroup>
          <FormControlLabel control={<Switch defaultChecked={editing.yuzutalk.avatarState === YuzutalkChatItemAvatarState.Show} id="edit-avatar" />} label={t("chat-edit-always-show-avatar")} />
        </FormGroup>

        {editing === null ? null :
          <FormControl fullWidth>
            <InputLabel id="item-type-label">{t("item-type")}</InputLabel>
            {editable ?
              <Select
                labelId="item-type-label"
                inputProps={{
                  id: "item-type-select"
                }}
                defaultValue={editing.yuzutalk.type}
                label={t("item-type")}
              >
                <MenuItem value={YuzutalkChatItemType.Text}>{t("item-type-text")}</MenuItem>
                <MenuItem value={YuzutalkChatItemType.Choices}>{t("item-type-choices")}</MenuItem>
                <MenuItem value={YuzutalkChatItemType.RelationshipStory}>{t("item-type-relationship-story")}</MenuItem>
                <MenuItem value={YuzutalkChatItemType.Narration}>{t("item-type-narration")}</MenuItem>
              </Select> :
              <Select
                labelId="item-type-label"
                inputProps={{
                  id: "item-type-select"
                }}
                defaultValue={YuzutalkChatItemType.Image}
                label={t("item-type")}
                disabled={true}
              >
                <MenuItem value={YuzutalkChatItemType.Image}>{t("item-type-image")}</MenuItem>
              </Select>
            }
          </FormControl>
        }
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => {
          props.setChat(chat.filter(ch => ch !== editing));
          props.setEditingNull();
          props.setInsertIdx(-1);
        }}>{t("chat-edit-delete")}</Button>
      </DialogActions>
    </Dialog>
  );
}
