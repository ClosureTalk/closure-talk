import ChatChar from "./ChatChar";
import { ChatItemAvatarType } from "./ChatItemAvatarType";
import { ChatItemType } from "./ChatItemType";

export default class ChatItem {
  char: ChatChar | null;
  content: string;
  type: ChatItemType;
  avatar: ChatItemAvatarType;
  nameOverride: string;

  constructor(
    char: ChatChar | null,
    content: string,
    type: ChatItemType,
    avatar = ChatItemAvatarType.Auto,
    nameOverride = "",
  ) {
    this.char = char;
    this.content = content;
    this.type = type;
    this.avatar = avatar;
    this.nameOverride = nameOverride;
  }

  is_stamp(): boolean {
    return this.type === ChatItemType.Image && !this.content.startsWith("data:image");
  }

  is_editable(): boolean {
    return this.type !== ChatItemType.Image;
  }
}
