import CustomDataSource from "../data/CustomDataSource";
import Character from "../model/Character";
import ChatChar from "../model/ChatChar";
import ChatItem from "../model/ChatItem";
import CustomCharacter from "../model/CustomCharacter";
import { ArknightsChatItemProps } from "../model/props/ArknightsProps";
import { YuzutalkChatItemProps } from "../model/props/YuzutalkProps";
import { convertBACollectionImage } from "./migration/MigrateBACollectionRemoval";

export function serialize_chat(chat: ChatItem[] | null, activeChars: ChatChar[] | null, customChars: Character[] | null = null): string {
  return JSON.stringify({
    chat: chat?.map(ch => ({
      char_id: ch.char?.character.id,
      img: ch.char?.img,
      is_breaking: ch.is_breaking,
      content: ch.content,
      yuzutalk: ch.yuzutalk,
      arknights: ch.arknights,
    })),
    chars: activeChars?.map(ch => ({
      char_id: ch.character.id,
      img: ch.img,
    })),
    custom_chars: customChars?.map((ch) => {
      let c = ch as CustomCharacter;
      return {
        char_id: c.id,
        img: c.image,
        name: c.names.get("zh-cn"),
      };
    }),
  }, undefined, 2);
}

export function deserialize_chat(text: string, characters: Map<string, Character>): [ChatItem[], ChatChar[]] {
  const obj = JSON.parse(text);

  const getChatChar = (id: string | null, img: string | null) => {
    if (id === null || img === null) {
      return null;
    }

    const char = characters.get(id);
    if (!char) {
      return null;
    }

    let updatedImg = img;
    if (char.id.startsWith("ba-") && img.endsWith("_Collection")) {
      updatedImg = convertBACollectionImage(img);
    }

    if (!char.images.includes(updatedImg)) {
      return null;
    }

    return new ChatChar(char, updatedImg);
  };

  const chat = (obj.chat as any[]).map(ch => new ChatItem({
    char: getChatChar(ch.char_id, ch.img),
    is_breaking: ch.is_breaking,
    content: ch.content,
    yuzutalk: new YuzutalkChatItemProps(ch.yuzutalk),
    arknights: new ArknightsChatItemProps(ch.arknights),
  }));
  const existingIds = new Set<string>();
  const chars = (obj.chars as any[]).map(ch => getChatChar(ch.char_id, ch.img)).filter(ch => {
    if (ch === null) {
      return false;
    }

    if (existingIds.has(ch.get_id())) {
      return false;
    }

    existingIds.add(ch.get_id());
    return true;
  }) as ChatChar[];

  return [chat, chars];
}

export async function deserialize_custom_chars(text: string, ds: CustomDataSource): Promise<CustomCharacter[]> {
  const obj = JSON.parse(text);
  const chars = await ds.get_characters();
  // ensure that json without "custom_chars" field can also be imported
  if (!obj.custom_chars) {
    return [];
  }

  const customChars = (obj.custom_chars as any[]).map(ch => {
    const char = new CustomCharacter(ds, ch.name, ch.img);
    char.id = ch.char_id;
    chars.forEach((c) => {
      if (c.id === ch.char_id) {
        ds.remove_character(c as CustomCharacter);
      }
    });
    ds.add_character(char);
    return char;
  }
  );
  return customChars;
}

export function load_local_storage_chat(characters: Map<string, Character>): [ChatItem[], ChatChar[]] {
  const text = localStorage.getItem("last-chat");
  if (text === null) {
    return [[], []];
  }
  return deserialize_chat(text, characters);
}
