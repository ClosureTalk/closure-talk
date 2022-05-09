import ChatChar from "./ChatChar";
import { ChatItemAvatarType } from "./ChatItemAvatarType";
import { ChatItemType } from "./ChatItemType";

export default class ChatItem {
  char: ChatChar | null;
  content: string;
  type: ChatItemType;
  avatar: ChatItemAvatarType;

  constructor(
    char: ChatChar | null,
    content: string,
    type: ChatItemType,
    avatar: ChatItemAvatarType,
  ) {
    this.char = char;
    this.content = content;
    this.type = type;
    this.avatar = avatar;
  }
}
