import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../model/AppContext";
import ChatItem from "../model/ChatItem";
import { ChatItemAvatarType } from "../model/ChatItemAvatarType";
import { ClearChatEventName, LoadCodeEventName, SaveCodeEventName } from "../model/Events";
import { render_chat } from "../renderer/RendererFactory";
import { deserialize_chat, load_local_storage_chat, serialize_chat } from "../utils/ChatUtils";
import { get_now_filename } from "../utils/DateUtils";
import { download_text } from "../utils/DownloadUtils";
import { prompt_file, read_file_as_text } from "../utils/FileUtils";
import { get_key_string } from "../utils/KeyboardUtils";
import ChatInputView from "./ChatInputView";

export default function ChatView() {
  const ctx = useAppContext();
  const { t } = useTranslation();
  const lastChat = load_local_storage_chat(ctx.data.characters)[0];

  const [chat, setChatRaw] = useState<ChatItem[]>(lastChat);
  const [confirmingClearChat, setConfirmingClearChat] = useState(false);
  const [editing, setEditing] = useState<ChatItem | null>(null);
  const [insertIdx, setInsertIdx] = useState(-1);
  const [chatHistory, setChatHistory] = useState<string[]>([serialize_chat(lastChat, ctx.activeChars)]);
  const [chatHistoryIdx, setChatHistoryIdx] = useState(1);

  const setChatSaved = (list: ChatItem[], serailized: string) => {
    localStorage.setItem("last-chat", serailized);
    setChatRaw(list);
  };

  const setChat = (list: ChatItem[]) => {
    const latest = serialize_chat(list, ctx.activeChars);

    // when a new state is commited, it becomes the latest history entry
    const newHistory = chatHistory.slice(0, chatHistoryIdx);
    newHistory.push(latest);

    setChatHistory(newHistory);
    setChatHistoryIdx(newHistory.length);
    setChatSaved(list, latest);
  };

  // undo and redo
  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (ev.target !== document.body || ev.repeat) {
        return;
      }
      const key = get_key_string(ev);

      let idx = -1;
      if (["Control+z", "Meta+z"].includes(key) && chatHistoryIdx > 1) {
        idx = chatHistoryIdx - 2;
        setChatHistoryIdx(chatHistoryIdx - 1);
      }
      else if (["Control+y", "Meta+y"].includes(key) && chatHistoryIdx < chatHistory.length) {
        idx = chatHistoryIdx;
        setChatHistoryIdx(chatHistoryIdx + 1);
      }

      if (idx >= 0) {
        const newChatText = chatHistory[idx];
        const newChat = deserialize_chat(newChatText, ctx.data.characters)[0];
        setChatSaved(newChat, newChatText);
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  });

  // save JSON
  useEffect(() => {
    const handler = () => {
      download_text(serialize_chat(chat, ctx.activeChars), `closure-talk-${get_now_filename()}.json`);
    };

    window.addEventListener(SaveCodeEventName, handler);
    return () => {
      window.removeEventListener(SaveCodeEventName, handler);
    };
  });

  // load JSON
  useEffect(() => {
    const handler = async () => {
      const file = await prompt_file(".json");
      if (file === null) {
        return;
      }

      try {
        const text = await read_file_as_text(file);
        const [newChat, newChars] = deserialize_chat(text, ctx.data.characters);

        setChat(newChat);
        ctx.setActiveChars(newChars);
      }
      catch (ex) {
        console.error(ex);
      }
    };

    window.addEventListener(LoadCodeEventName, handler);
    return () => {
      window.removeEventListener(LoadCodeEventName, handler);
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
      const targetIdx = Math.max(0, insertIdx - 3);
      document.querySelectorAll(".chat-item")[targetIdx].scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, insertIdx]);

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
      setInsertIdx(insertIdx === idx + 1 ? -1 : idx + 1);
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
          const getElement = (id: string) => document.getElementById(id) as HTMLInputElement;
          item.avatar = getElement("edit-avatar").checked ? ChatItemAvatarType.Show : ChatItemAvatarType.Auto;
          if (item.is_editable()) {
            item.content = getElement("edit-content").value;
          }
          item.nameOverride = getElement("name-override").value.trim();
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
            defaultValue={editing?.is_editable() ? editing?.content : ""}
            onFocus={ev => ev.target.select()}
            disabled={!(editing?.is_editable())}
          />
          <TextField
            margin="dense"
            id="name-override"
            label={t("Name override")}
            fullWidth
            variant="standard"
            defaultValue={editing?.nameOverride}
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
    </Box>
  );
}
