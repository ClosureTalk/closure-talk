import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Chip, IconButton, Input, Popover, Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../model/AppContext";
import ChatChar from "../model/ChatChar";
import ChatItem from "../model/ChatItem";
import CustomCharacter from "../model/CustomCharacter";
import { createChatItem } from "../renderer/RendererFactory";
import { get_key_string } from "../utils/KeyboardUtils";
import ChatSpecialPopover from "./ChatSpecialPopover";
import CustomCharDialog from "./CustomCharDialog";
import RemoveCustomCharDialog from "./RemoveCustomCharDialog";

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
  setChat = (updated: ChatItem[]) => { };
  insertIdx = -1;
  setInsertIdx = (idx: number) => { };
}


export default function ChatInputView(props: ChatInputViewProps) {
  const ctx = useAppContext();
  const { t } = useTranslation();
  const [currentChar, setCurrentChar] = useState<ChatChar | null>(null);
  const [previousActiveCharLength, setPreviousActiveCharLength] = useState(0);
  const [selectImageAnchor, setSelectImageAnchor] = useState<HTMLElement | null>(null);
  const [customCharOpen, setCustomCharOpen] = useState(false);
  const [removingCustomChar, setRemovingCustomChar] = useState<CustomCharacter | null>(null);
  const boxHeight = ctx.isWideScreen ? 240 : 200;

  function focusOnInput() {
    if (!ctx.isWideScreen) {
      return;
    }
    document.getElementById("chat-input")!.focus();
  }

  // set new active char if new char is added
  useEffect(() => {
    if (ctx.activeChars.length === previousActiveCharLength) {
      return;
    }

    if (ctx.activeChars.length > previousActiveCharLength) {
      setCurrentChar(ctx.activeChars[ctx.activeChars.length - 1]);
      focusOnInput();
    }
    setPreviousActiveCharLength(ctx.activeChars.length);
  }, [ctx.activeChars, previousActiveCharLength]);

  const addChat = (item: ChatItem) => {
    const newChat = [...props.chat];
    const idx = props.insertIdx;
    if (idx >= 0) {
      newChat.splice(idx, 0, item);
      props.setInsertIdx(Math.min(idx + 1, newChat.length));
    }
    else {
      newChat.push(item);
    }

    props.setChat(newChat);
  };

  const addNormalChat = () => {
    const input = document.getElementById("chat-input") as HTMLInputElement;
    const content = input.value;
    if (content.length === 0) {
      return;
    }

    input.value = "";
    addChat(createChatItem(currentChar, content, false));
  };

  const addImageChat = (url: string) => {
    addChat(createChatItem(currentChar, url, true));
  };

  const deleteActiveChar = (ch: ChatChar) => {
    console.log(ch);
    if (ch.character.is_custom()) {
      setRemovingCustomChar(ch.character as CustomCharacter);
    }

    ctx.setActiveChars(ctx.activeChars.filter(c => c.get_id() !== ch.get_id()));
  };

  return (
    <Box sx={{
      height: `${boxHeight}px`,
      width: "100%",
    }}>
      <Stack direction="row" spacing={1} paddingLeft="4px" paddingTop="4px">
        <IconButton
          onClick={ev => setSelectImageAnchor(ev.target as HTMLElement)}
        >
          <Avatar src={currentChar?.character.get_url(currentChar.img)} alt={`Avatar of ${currentChar?.character.get_short_name("en") || "player"}`} />
        </IconButton>
        <Popover
          open={selectImageAnchor !== null}
          onClose={() => setSelectImageAnchor(null)}
          anchorEl={selectImageAnchor}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <ChatSpecialPopover addImage={addImageChat} closePopover={() => setSelectImageAnchor(null)} />
        </Popover>
        <Input id="chat-input" fullWidth placeholder={t("chat-input-placeholder")} multiline onKeyDown={(ev) => {
          if (get_key_string(ev.nativeEvent) === "Enter") {
            ev.preventDefault();
            addNormalChat();
            return;
          }
          if (ev.ctrlKey) {
            const num = Number(ev.key);
            if (num === 1) {
              setCurrentChar(null);
            }
            if (num >= 2 && num <= ctx.activeChars.length + 1) {
              setCurrentChar(ctx.activeChars[num - 2]);
            }
          }
        }} />
        <IconButton onClick={() => addNormalChat()}>
          <SendIcon />
        </IconButton>
      </Stack>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: "8px",
        height: `${boxHeight - 44}px`,
        overflowY: "scroll",
        alignContent: "flex-start",
        gap: "4px",
      }}>
        <PlayerChip
          variant="outlined"
          avatar={<Avatar alt="Avatar of player" />}
          onClick={() => setCurrentChar(null)}
        />
        {ctx.activeChars.map(ch => (
          <LargeChip
            key={ch.get_id()}
            variant="outlined"
            avatar={
              <Avatar src={ch.character.get_url(ch.img)} alt={`Avatar of ${ch.character.get_short_name("en")}`} />
            }
            onClick={() => {
              setCurrentChar(ch);
              focusOnInput();
            }}
            onDelete={() => { deleteActiveChar(ch); }}
          />
        ))}
        <PlayerChip
          variant="outlined"
          avatar={
            <Avatar sx={{ bgcolor: "white" }}><AddIcon /></Avatar>
          }
          onClick={() => { setCustomCharOpen(true); }}
        />
      </Box>
      <CustomCharDialog open={customCharOpen} setClose={() => { setCustomCharOpen(false); }} />
      <RemoveCustomCharDialog char={removingCustomChar} setClose={() => { setRemovingCustomChar(null); }} />
    </Box>
  );
}
