import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../model/AppContext";
import ChatItem from "../model/ChatItem";
import { ClearChatEventName, LoadCodeEventName, SaveCodeEventName } from "../model/Events";
import { editChatDialog, renderChat } from "../renderer/RendererFactory";
import { deserialize_chat, deserialize_custom_chars, serialize_chat, serialize_chat_with_custom_chars } from "../utils/ChatUtils";
import { get_now_filename } from "../utils/DateUtils";
import { download_text } from "../utils/DownloadUtils";
import { prompt_file, read_file_as_text } from "../utils/FileUtils";
import { get_key_string } from "../utils/KeyboardUtils";
import CharList from "./CharList";
import ChatInputView from "./ChatInputView";
import { DataSources } from "../model/Constants";
import CustomDataSource from "../data/CustomDataSource";

export default function ChatView() {
  const ctx = useAppContext();
  const { t } = useTranslation();
  const chat = ctx.chat;

  const [confirmingClearChat, setConfirmingClearChat] = useState(false);
  const [editing, setEditing] = useState<ChatItem | null>(null);
  const [insertIdx, setInsertIdx] = useState(-1);
  const [chatHistory, setChatHistory] = useState<string[]>([serialize_chat(chat, ctx.activeChars)]);
  const [chatHistoryIdx, setChatHistoryIdx] = useState(1);
  const previousChat = useRef<ChatItem[]>([]);

  const setChatSaved = (list: ChatItem[], serailized: string) => {
    localStorage.setItem("last-chat", serailized);
    ctx.setChat(list);
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
        const newChat = deserialize_chat(newChatText, ctx.characters)[0];
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
    const handler = async () => {
      const ds = DataSources[DataSources.length - 1] as CustomDataSource;
      const customChars = await ds.get_characters();
      const serializedStr = await serialize_chat_with_custom_chars(chat, ctx.activeChars, customChars);
      download_text(serializedStr, `closure-talk-${get_now_filename()}.json`);
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

        const ds = DataSources[DataSources.length - 1] as CustomDataSource;
        const customChars = deserialize_custom_chars(text, ds)
        customChars.map((char)=>{
          ctx.characters.set(char.id, char);
        })

        const [newChat, newChars] = deserialize_chat(text, ctx.characters);

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
    const previous = previousChat.current;
    previousChat.current = chat;
    if (chat.length <= previous.length || chat.length === 0) {
      return;
    }

    const idx = insertIdx < 0 ? chat.length - 1 : Math.min(Math.max(insertIdx - 1, 0), chat.length - 1);
    document.querySelectorAll(".chat-item")[idx].scrollIntoView({ behavior: "smooth", block: "center" });
  }, [chat, insertIdx]);

  // left click handler
  const clickCallback = (ev: MouseEvent, item: ChatItem) => {
    if (ev.button !== 0) {
      return;
    }

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
    if (ctx.isWideScreen) {
      document.getElementById("chat-input")!.focus();
    }
    else if (insertIdx === -1 || idx === chat.length - 1) {
      setEditing(item);
    }
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
        {(!ctx.isWideScreen && ctx.showCharListOverlay) ?
          <CharList /> :
          renderChat(ctx.renderer, chat, clickCallback, contextMenuCallback, insertIdx)}
      </Box>
      <ChatInputView chat={chat} setChat={setChat} insertIdx={insertIdx} setInsertIdx={setInsertIdx} />
      <Dialog
        open={confirmingClearChat}
        onClose={() => setConfirmingClearChat(false)}
      >
        <DialogTitle>{t("clear-chat-confirm-title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("clear-chat-confirm-text")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmingClearChat(false)}>{t("clear-chat-confirm-cancel")}</Button>
          <Button color="warning" onClick={() => {
            setChat([]);
            setInsertIdx(-1);
            setConfirmingClearChat(false);
          }}>{t("clear-chat-confirm-yes")}</Button>
        </DialogActions>
      </Dialog>
      {editChatDialog(
        ctx.renderer,
        editing,
        () => setEditing(null),
        chat,
        setChat,
        setInsertIdx,
      )}
    </Box>
  );
}
