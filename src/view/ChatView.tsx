import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../model/AppContext";
import ChatItem from "../model/ChatItem";
import { ChatItemAvatarType } from "../model/ChatItemAvatarType";
import { ClearChatEventName, LoadCodeEventName, SaveCodeEventName } from "../model/Events";
import { render_chat } from "../renderer/RendererFactory";
import { deserialize_chat, serialize_chat } from "../utils/ChatUtils";
import { get_now_filename } from "../utils/DateUtils";
import { download_text } from "../utils/DownloadUtils";
import { read_file } from "../utils/FileUtils";
import ChatInputView from "./ChatInputView";

export default function ChatView() {
  const ctx = useAppContext();
  const {t} = useTranslation();
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [confirmingClearChat, setConfirmingClearChat] = useState(false);
  const [editing, setEditing] = useState<ChatItem|null>(null);
  const [insertIdx, setInsertIdx] = useState(-1);

  // save JSON
  useEffect(() => {
    const handler = () => {
      download_text(serialize_chat(chat, ctx), `closure-talk-${get_now_filename()}.json`);
    };

    window.addEventListener(SaveCodeEventName, handler);
    return () => {
      window.removeEventListener(SaveCodeEventName, handler);
    };
  });

  // load JSON
  useEffect(() => {
    const file = document.getElementById("upload-code-file") as HTMLInputElement;
    const uploadHandler = async () => {
      if ((file.files?.length || 0) === 0) {
        return;
      }

      try {
        const text = await read_file(file.files![0]);
        const [newChat, newChars] = deserialize_chat(text, ctx);

        setChat(newChat);
        ctx.setActiveChars(newChars);
      }
      catch (ex) {
        console.error(ex);
      }

      file.value = "";
    };

    file.addEventListener("change", uploadHandler);

    const handler = () => {
      file.click();
    };

    window.addEventListener(LoadCodeEventName, handler);
    return () => {
      window.removeEventListener(LoadCodeEventName, handler);
      file.removeEventListener("change", uploadHandler);
    };
  });

  // clear chat confirmation
  useEffect(() => {
    const handler = () => setConfirmingClearChat(true);

    window.addEventListener(ClearChatEventName, handler);
    return () => {
      window.removeEventListener(ClearChatEventName, handler);
    };
  });

  // scroll to inserted chat
  useEffect(() => {
    const container = document.getElementById("chat-container")!;
    if (insertIdx < 0) {
      container.scrollTo(0, container.scrollHeight);
    }
    else {
      const targetIdx = Math.max(0, insertIdx-3);
      document.querySelectorAll(".chat-item")[targetIdx].scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  // left click handler
  const clickCallback = (item: ChatItem) => {
    const idx = chat.indexOf(item);
    if (idx === 0) {
      setInsertIdx(insertIdx === 1 ? 0 : (insertIdx === 0 ? -1 : 1));
    }
    else if (idx === chat.length - 1) {
      setInsertIdx(-1);
    }
    else {
      setInsertIdx(insertIdx === idx+1 ? -1 : idx+1);
    }
    document.getElementById("chat-input")!.focus();
  };

  // right click handler
  const contextMenuCallback = (ev: MouseEvent, item: ChatItem) => {
    setEditing(item);
    ev.preventDefault();
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      <Box
      id="chat-container"
      sx={{
        flexGrow: 1,
        overflowY: "scroll",
      }}>
        {render_chat(ctx.renderer, chat, clickCallback, contextMenuCallback, insertIdx)}
      </Box>
      <ChatInputView chat={chat} setChat={setChat} insertIdx={insertIdx} setInsertIdx={setInsertIdx} />
      <Dialog
        open={confirmingClearChat}
        onClose={() => setConfirmingClearChat(false)}
        >
          <DialogTitle>{t("Clear chat confirm title")}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t("Clear chat confirm text")}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmingClearChat(false)}>{t("Cancel")}</Button>
            <Button color="warning" onClick={() => {
              setChat([]);
              setInsertIdx(-1);
              setConfirmingClearChat(false);
            }}>{t("Yes")}</Button>
          </DialogActions>
      </Dialog>
      <Dialog
        open={editing !== null}
        onClose={() => {
          const item = editing!;
          item.avatar = (document.getElementById("edit-avatar") as HTMLInputElement).checked ? ChatItemAvatarType.Show : ChatItemAvatarType.Auto;
          item.content = (document.getElementById("edit-content") as HTMLInputElement).value;
          setChat([...chat]);
          setEditing(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="edit-content"
            label={t("Content")}
            fullWidth
            multiline
            variant="standard"
            defaultValue={editing?.content}
            onFocus={ev => ev.target.select()}
          />
          <FormGroup>
            <FormControlLabel control={<Switch defaultChecked={editing?.avatar === ChatItemAvatarType.Show} id="edit-avatar" />} label={t("Always show avatar")} />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => {
              setChat(chat.filter(ch => ch !== editing));
              setEditing(null);
              setInsertIdx(-1);
            }}>{t("Delete")}</Button>
        </DialogActions>
      </Dialog>
      <input type="file" id="upload-code-file" accept="application/json" style={{
        display: "none"
      }}></input>
    </Box>
  )
}
