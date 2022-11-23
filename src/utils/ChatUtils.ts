import Character from "../model/Character";
import ChatChar from "../model/ChatChar";
import ChatItem from "../model/ChatItem";
import { ArknightsChatItemProps } from "../model/props/ArknightsProps";
import { YuzutalkChatItemProps } from "../model/props/YuzutalkProps";

export function serialize_chat(chat: ChatItem[], activeChars: ChatChar[]): string {
  return JSON.stringify({
    chat: chat.map(ch => ({
      char_id: ch.char?.character.id,
      img: ch.char?.img,
      content: ch.content,
      yuzutalk: ch.yuzutalk,
      arknights: ch.arknights,
    })),
    chars: activeChars.map(ch => ({
      char_id: ch.character.id,
      img: ch.img,
    })),
  }, undefined, 2);
}

export function deserialize_chat(text: string, characters: Map<string, Character>): [ChatItem[], ChatChar[]] {
  const obj = JSON.parse(text);

  const chat = (obj.chat as any[]).map(ch => {
    const char = characters.get(ch.char_id) || null;
    const valid = char !== null && char.images.includes(ch.img);

    ch.yuzutalk = ch.yuzutalk ?? new YuzutalkChatItemProps();

    return new ChatItem({
      char: valid ? new ChatChar(char, ch.img) : null,
      content: ch.content,
      yuzutalk: new YuzutalkChatItemProps(ch.yuzutalk),
      arknights: new ArknightsChatItemProps(ch.arknights),
    });
  });

  const chars = (obj.chars as any[]).map(ch => {
    const char = characters.get(ch.char_id) || null;
    const valid = char !== null && char.images.includes(ch.img);
    return valid ? new ChatChar(char, ch.img) : null;
  }).filter(ch => ch !== null) as ChatChar[];

  return [chat, chars];
}

export function load_local_storage_chat(characters: Map<string, Character>): [ChatItem[], ChatChar[]] {
  const text = localStorage.getItem("last-chat");
  if (text === null) {
    return [[], []];
  }
  return deserialize_chat(text, characters);
}
