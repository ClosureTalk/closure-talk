import { Popover, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlayerChip } from "../component/AvatarChips";
import { useAppContext } from "../model/AppContext";
import ChatItem from "../model/ChatItem";
import { GetCharAvatar, GetPlayerAvatar } from "../utils/AvatarUtils";
import ChatChar from "../model/ChatChar";

interface EditDialogCommonPartsProps {
  isContentEditable: boolean;
  chat: ChatItem;
}

export function applyCharEdit(chat: ChatItem, activeChars: ChatChar[]) {
  const selected = (document.getElementById("chat-edit-sender") as HTMLInputElement).value;
  const original = chat.char?.get_id() || "null";
  if (selected === original) {
    return;
  }
  if (selected === "null") {
    chat.char = null;
    return;
  }

  const updated = activeChars.find(ch => ch.get_id() === selected);
  if (updated) {
    chat.char = updated;
  }
}

export function EditDialogCommonParts(props: EditDialogCommonPartsProps) {
  const { t } = useTranslation();
  const ctx = useAppContext();
  const [selectSenderAnchor, setSelectSenderAnchor] = useState<HTMLElement | null>(null);
  const [selectedChar, setSelectedChar] = useState(props.chat.char);
  const chat = props.chat;
  const char = chat.char;

  return (
    <>
      <input style={{display: "none"}} id="chat-edit-sender" defaultValue={char === null ? "null" : char.get_id()} />
      <Stack direction="row" alignItems="baseline" gap={2}>
        <Typography variant="body1" component="span">{t("chat-edit-sender")}</Typography>
        <PlayerChip
          variant="outlined"
          avatar={
            selectedChar === null ? GetPlayerAvatar() : GetCharAvatar(selectedChar)
          }
          onClick={ev => setSelectSenderAnchor(ev.target as HTMLElement)}
        />
      </Stack>
      <TextField
        autoFocus
        margin="dense"
        id="edit-content"
        label={t("chat-edit-content")}
        fullWidth
        multiline
        variant="standard"
        defaultValue={props.isContentEditable ? chat.content : ""}
        onFocus={ev => ev.target.select()}
        disabled={!props.isContentEditable}
      />
      <Popover
        open={selectSenderAnchor !== null}
        onClose={() => setSelectSenderAnchor(null)}
        anchorEl={selectSenderAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Stack direction="row" sx={{
          width: "360px",
          padding: "12px",
          flexWrap: "wrap",
          gap: "8px",
        }}>
          <PlayerChip
            variant="outlined"
            avatar={GetPlayerAvatar()}
            onClick={ev => setSelectSenderAnchor(ev.target as HTMLElement)}
          />

          {ctx.activeChars.map(ch => (
            <PlayerChip
              key={ch.get_id()}
              variant="outlined"
              avatar={GetCharAvatar(ch)}
              onClick={() => {
                const hidden = document.getElementById("chat-edit-sender") as HTMLInputElement;
                hidden.value = ch.get_id();
                console.log(`update value to ${hidden.value}`);

                setSelectedChar(ch);
                setSelectSenderAnchor(null);
              }}
            />
          ))}
        </Stack>
      </Popover>
    </>
  );
}
