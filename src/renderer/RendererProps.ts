import ChatItem from "../model/ChatItem";

export default class RendererProps {
  chat: ChatItem[] = [];
  click = (item: ChatItem) => {};
  contextMenuCallback = (ev: MouseEvent, item: ChatItem) => {};
  insertIdx = -1;
}
