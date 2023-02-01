import ChatItem from "../model/ChatItem";

export default class RendererProps {
  chat: ChatItem[] = [];
  click = (ev: MouseEvent, item: ChatItem) => { };
  contextMenuCallback = (ev: MouseEvent, item: ChatItem) => { };
  insertIdx = -1;
}
