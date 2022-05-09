import { Avatar, Button, Chip, IconButton, Input, Stack, TextField } from "@mui/material";
import { Box, styled } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import { useAppContext } from "../model/AppContext";
import { useEffect, useState } from "react";
import ChatChar from "../model/ChatChar";
import ChatItem from "../model/ChatItem";
import { ChatItemType } from "../model/ChatItemType";
import { ChatItemAvatarType } from "../model/ChatItemAvatarType";

const LargeChip = styled(Chip)(() => ({
  width: "92px",
  height: "60px",
  "& .MuiChip-avatar": {
    width: "48px",
    height: "48px",
  }
}));

const PlayerChip = styled(LargeChip)(() => ({
  width: "60px",
  "& .MuiChip-avatar": {
    margin: "0",
  },
  "& .MuiChip-label": {
    padding: "0",
  }
}));

class ChatInputViewProps {
  chat: ChatItem[] = [];
  setChat = (updated: ChatItem[]) => {};
  insertIdx = -1;
  setInsertIdx = (idx: number) => {};
}

function focusOnInput() {
  document.getElementById("chat-input")!.focus();
}

export default function ChatInputView(props: ChatInputViewProps) {
  const ctx = useAppContext();
  const [currentChar, setCurrentChar] = useState<ChatChar | null>(null);
  const [previousActiveCharLength, setPreviousActiveCharLength] = useState(0);
  const boxHeight = 240;

  // set new active char if new char is added
  useEffect(() => {
    if (ctx.activeChars.length === previousActiveCharLength) {
      return;
    }

    if (ctx.activeChars.length > previousActiveCharLength) {
      setCurrentChar(ctx.activeChars[ctx.activeChars.length-1]);
      focusOnInput();
    }
    setPreviousActiveCharLength(ctx.activeChars.length);
  }, [ctx.activeChars]);

  const addChat = (input: HTMLInputElement) => {
    const content = input.value;
    if (content.length === 0) {
      return;
    }

    input.value = "";

    const type = currentChar === null ? ChatItemType.Player : ChatItemType.Character;
    const item = new ChatItem(currentChar, content, type, ChatItemAvatarType.Auto);
    const newChat = [...props.chat];
    const idx = props.insertIdx;
    if (idx >= 0) {
      newChat.splice(idx, 0, item);
      props.setInsertIdx(idx+1);
    }
    else {
      newChat.push(item);
    }

    props.setChat(newChat);
  };

  return (
    <Box sx={{
      height: `${boxHeight}px`,
      width: "100%",
    }}>
      <Stack direction="row" spacing={1} paddingLeft="4px" paddingTop="4px">
        <Avatar src={currentChar?.character.get_url(currentChar.img)} />
        <Input id="chat-input" fullWidth placeholder="Chat" multiline onKeyDown={(ev) => {
          if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            addChat(ev.target as HTMLInputElement);
          }
          if (ev.ctrlKey) {
            const num = Number(ev.key);
            if (num === 1) {
              setCurrentChar(null);
            }
            if (num >= 2 && num <= ctx.activeChars.length+1) {
              setCurrentChar(ctx.activeChars[num-2]);
            }
          }
        }} />
        <IconButton>
          <SendIcon />
        </IconButton>
      </Stack>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: "8px",
        height: `${boxHeight-44}px`,
        overflowY: "scroll",
        alignContent: "flex-start",
        gap: "4px",
      }}>
        <PlayerChip
          variant="outlined"
          avatar={<Avatar />}
          onClick={() => setCurrentChar(null)}
        />
        {ctx.activeChars.map(ch => (
          <LargeChip
            key={ch.get_id()}
            variant="outlined"
            avatar={
              <Avatar src={ch.character.get_url(ch.img)} />
            }
            onClick={() => {
              setCurrentChar(ch);
              focusOnInput();
            }}
            onDelete={() => ctx.setActiveChars(ctx.activeChars.filter(c => c.get_id() !== ch.get_id()))}
          />
        ))}
      </Box>
    </Box>
  )
}
