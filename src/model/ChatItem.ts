import ChatChar from "./ChatChar";
import { ArknightsChatItemProps } from "./props/ArknightsProps";
import { YuzutalkChatItemProps } from "./props/YuzutalkProps";

export default class ChatItem {
  char: ChatChar | null = null;
  content = "";
  yuzutalk = new YuzutalkChatItemProps();
  arknights = new ArknightsChatItemProps();

  constructor(obj: Partial<ChatItem> | null | undefined = {}) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
