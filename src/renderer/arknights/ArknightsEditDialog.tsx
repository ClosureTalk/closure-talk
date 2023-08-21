import { Dialog, DialogContent, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ArknightsChatItemType } from "../../model/props/ArknightsProps";
import EditDialogActions from "../EditDialogActions";
import { EditDialogCommonParts, applyCharEdit } from "../EditDialogCommons";
import EditDialogProps from "../EditDialogProps";
import { useAppContext } from "../../model/AppContext";


export default function ArknightsEditDialog(props: EditDialogProps) {
  const editing = props.editing;
  const chat = props.chat;
  const { t } = useTranslation();
  const ctx = useAppContext();
  const editable = editing !== null && editing.arknights.type !== ArknightsChatItemType.Image;
  const apply = () => {
    const item = editing!;

    const getElement = (id: string) => document.getElementById(id) as HTMLInputElement;
    item.is_breaking = getElement("edit-is-breaking").checked;
    applyCharEdit(item, ctx.activeChars);

    if (editable) {
      item.content = getElement("edit-content").value;
      item.arknights.type = getElement("item-type-select").value as ArknightsChatItemType;
      props.setChat([...chat]);
    }
  };

  return editing === null ? <></> : (
    <Dialog
      open={true}
      onClose={() => {
        apply();
        props.setEditingNull();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <EditDialogCommonParts
          isContentEditable={editable}
          chat={editing}
        />
        <FormControl fullWidth size="small">
          <InputLabel id="item-type-label">{t("item-type")}</InputLabel>
          {editable ?
            <Select
              labelId="item-type-label"
              inputProps={{
                id: "item-type-select"
              }}
              defaultValue={editing.arknights.type}
              label={t("item-type")}
            >
              <MenuItem value={ArknightsChatItemType.Text}>{t("item-type-text")}</MenuItem>
              <MenuItem value={ArknightsChatItemType.Thoughts}>{t("item-type-thoughts")}</MenuItem>
              <MenuItem value={ArknightsChatItemType.SectionTitle}>{t("item-type-section-title")}</MenuItem>
              <MenuItem value={ArknightsChatItemType.Choices}>{t("item-type-choices")}</MenuItem>
              <MenuItem value={ArknightsChatItemType.Selection}>{t("item-type-selection")}</MenuItem>
              <MenuItem value={ArknightsChatItemType.Narration}>{t("item-type-narration")}</MenuItem>
            </Select> :
            <Select
              labelId="item-type-label"
              inputProps={{
                id: "item-type-select"
              }}
              defaultValue={ArknightsChatItemType.Image}
              label={t("item-type")}
              disabled={true}
            >
              <MenuItem value={ArknightsChatItemType.Image}>{t("item-type-image")}</MenuItem>
            </Select>
          }
          <FormGroup>
            <FormControlLabel control={<Switch defaultChecked={editing.is_breaking} id="edit-is-breaking" />} label={t("chat-edit-is-breaking")} />
          </FormGroup>
        </FormControl>
      </DialogContent>
      <EditDialogActions
        editDialogProps={props}
        onApply={apply}
        onCancel={() => { }}
      />
    </Dialog>
  );
}
