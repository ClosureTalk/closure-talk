import CustomDataSource from "../data/CustomDataSource";
import Character from "../model/Character";
import CustomCharacter from "../model/CustomCharacter";
import ChatChar from "../model/ChatChar";
import ChatItem from "../model/ChatItem";
import { ArknightsChatItemProps } from "../model/props/ArknightsProps";
import { YuzutalkChatItemProps } from "../model/props/YuzutalkProps";

export function serialize_chat(chat: ChatItem[], activeChars: ChatChar[]): string {
  return JSON.stringify({
    chat: chat.map(ch => ({
      char_id: ch.char?.character.id,
      img: ch.char?.img,
      is_breaking: ch.is_breaking,
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

export async function serialize_chat_with_custom_chars(chat: ChatItem[], activeChars: ChatChar[], customChars: Character[]): Promise<string> {
  return JSON.stringify({
    chat: chat.map(ch => ({
      char_id: ch.char?.character.id,
      img: ch.char?.img,
      is_breaking: ch.is_breaking,
      content: ch.content,
      yuzutalk: ch.yuzutalk,
      arknights: ch.arknights,
    })),
    chars: activeChars.map(ch => ({
      char_id: ch.character.id,
      img: ch.img,
    })),
    custom_chars: customChars.map((ch) => {
      let c = ch as CustomCharacter
      return {
        char_id: c.id,
        img: c.image,
        name: c.names.get("zh-cn"),
      }
    }),
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
      is_breaking: ch.is_breaking,
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

export async function deserialize_custom_chars(text: string, ds: CustomDataSource): Promise<CustomCharacter[]> {
  const obj = JSON.parse(text);
  const chars = await ds.get_characters();
  // ensure that json without "custom_chars" field can also be imported
  if (obj.custom_chars == undefined) {
    return [];
  }

  const customChars = (obj.custom_chars as any[]).map(ch => {
      const char = new CustomCharacter(ds, ch.name, ch.img)
      char.id = ch.char_id;
      chars.map((c) => {
        if (c.id == ch.char_id) {
          ds.remove_character(c as CustomCharacter);
        }
      })
      ds.add_character(char);
      return char;
    }
  )
  return customChars;
}

export function load_local_storage_chat(characters: Map<string, Character>): [ChatItem[], ChatChar[]] {
  const text = localStorage.getItem("last-chat");
  if (text === null) {
    return [[], []];
  }
  return deserialize_chat(text, characters);
}
