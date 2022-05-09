import { IAppContext } from "../model/AppContext";
import ChatChar from "../model/ChatChar";
import ChatItem from "../model/ChatItem";

export function serialize_chat(chat: ChatItem[], ctx: IAppContext): string {
  return JSON.stringify({
    chat: chat.map(ch => ({
      char_id: ch.char?.character.id,
      img: ch.char?.img,
      content: ch.content,
      type: ch.type,
      avatar: ch.avatar,
    })),
    chars: ctx.activeChars.map(ch => ({
      char_id: ch.character.id,
      img: ch.img,
    })),
  }, undefined, 2);
}

export function deserialize_chat(text: string, ctx: IAppContext): [ChatItem[], ChatChar[]] {
  const obj = JSON.parse(text);

  const chat = (obj.chat as any[]).map(ch => {
    const char = ctx.data.characters.get(ch.char_id) || null;
    const valid = char !== null && char.images.includes(ch.img);
    return new ChatItem(
      valid ? new ChatChar(char, ch.img) : null,
      ch.content,
      ch.type,
      ch.avatar,
    );
  });
  const chars = (obj.chars as any[]).map(ch => {
    const char = ctx.data.characters.get(ch.char_id) || null;
    const valid = char !== null && char.images.includes(ch.img);
    return valid ? new ChatChar(char, ch.img) : null;
  }).filter(ch => ch !== null) as ChatChar[];

  return [chat, chars];
}
