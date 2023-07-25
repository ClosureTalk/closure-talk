import { Dialog, DialogContent, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { YuzutalkChatItemAvatarState, YuzutalkChatItemType } from "../../model/props/YuzutalkProps";
import EditDialogActions from "../EditDialogActions";
import EditDialogProps from "../EditDialogProps";

export default function YuzutalkEditDialog(props: EditDialogProps) {
  const editing = props.editing;
  const chat = props.chat;
  const { t } = useTranslation();
  const editable = editing !== null && editing.yuzutalk.type !== YuzutalkChatItemType.Image;

  return editing === null ? <></> : (
    <Dialog
      open={true}
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

            <FormGroup>
              <FormControlLabel control={<Switch defaultChecked={editing.is_breaking} id="edit-is-breaking" />} label={t("chat-edit-is-breaking")} />
            </FormGroup>
          </FormControl>
        }
      </DialogContent>
      <EditDialogActions
        editDialogProps={props}
        onApply={() => {
          const item = editing!;

          const getElement = (id: string) => document.getElementById(id) as HTMLInputElement;
          if (editable) {
            item.content = getElement("edit-content").value;
            item.yuzutalk.type = getElement("item-type-select").value as YuzutalkChatItemType;
          }

          item.yuzutalk.avatarState = getElement("edit-avatar").checked ? YuzutalkChatItemAvatarState.Show : YuzutalkChatItemAvatarState.Auto;
          item.yuzutalk.nameOverride = getElement("name-override").value.trim();
          item.is_breaking = getElement("edit-is-breaking").checked;

          props.setChat([...chat]);
        }}
        onCancel={() => { }}
      />
    </Dialog>
  );
}
