import ChatChar from "../model/ChatChar";
import ChatItem from "../model/ChatItem";
import { ArknightsChatItemType } from "../model/props/ArknightsProps";
import { YuzutalkChatItemType } from "../model/props/YuzutalkProps";
import ArknightsEditDialog from "./arknights/ArknightsEditDialog";
import ArknightsRenderer from "./arknights/ArknightsRenderer";
import { RendererType } from "./RendererType";
import YuzutalkEditDialog from "./yuzutalk/YuzutalkEditDialog";
import YuzutalkRenderer from "./yuzutalk/YuzutalkRenderer";

export function renderChat(type: RendererType, chat: ChatItem[], clickCallback: (item: ChatItem) => void, contextMenuCallback: (ev: MouseEvent, item: ChatItem) => void, insertIdx: number) {
  switch (type) {
    case RendererType.Arknights:
      return (
        <ArknightsRenderer chat={chat} click={clickCallback} contextMenuCallback={contextMenuCallback} insertIdx={insertIdx} />
      );
    case RendererType.Yuzutalk:
      return (
        <YuzutalkRenderer chat={chat} click={clickCallback} contextMenuCallback={contextMenuCallback} insertIdx={insertIdx} />
      );
  }
}

export function editChatDialog(type: RendererType, editing: ChatItem | null, setEditingNull: () => void, chat: ChatItem[], setChat: (list: ChatItem[]) => void, setInsertIdx: (idx: number) => void) {
  switch (type) {
    case RendererType.Arknights:
      return (
        <ArknightsEditDialog editing={editing} setEditingNull={setEditingNull} chat={chat} setChat={setChat} setInsertIdx={setInsertIdx} />
      );
    case RendererType.Yuzutalk:
      return (
        <YuzutalkEditDialog editing={editing} setEditingNull={setEditingNull} chat={chat} setChat={setChat} setInsertIdx={setInsertIdx} />
      );
  }
}

export function createChatItem(char: ChatChar | null, content: string, isImage: boolean = false) {
  const item = new ChatItem({
    char: char,
    content: content,
  });

  if (isImage) {
    item.arknights.type = ArknightsChatItemType.Image;
    item.yuzutalk.type = YuzutalkChatItemType.Image;
  }

  return item;
}
