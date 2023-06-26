Blue Archive Localization
---

The fallback language of Blue Archive is _Japanese_.

Translations of Blue Archive characters are obtained as follows:

- We analyze the Japanese game data and try to obtain name(s) and avatars of every character (including citizens and mobs) who ever appeared in the story.
- Some characters (mostly released ones) have complete profile with **Japanese and Korean names** (e.g. 砂狼 シロコ / 스나오오카미 시로코). Others only have **Japanese first names** (e.g. イブキ). NPCs usually have multiple Japanese names per avatar.

To summarize:

- **English**
  - Character names are automatically inferred from Japanese. No manual translation is required in most cases.
  - NPC names are manually translated.
- **Chinese**
  - All character and NPC names are manually translated.
- **Korean**
  - Unreleased character and all NPC names are manually translated.

For Blue Archive there are also clubs and schools as filters. These are all manually organized and translated. Credits: many of them are taken from [Yuzutalk](https://github.com/YuzuTalk/translation).

## How to Contribute

The translation data of Blue Archive is _not_ in this repository. They're in the [closure-talk-resource](https://github.com/ClosureTalk/closure-talk-resource/tree/master/blue_archive/lang) repository.

Click on the link above and you'll see four `yaml` files. They contain all translations. Open any of them, and search for `''` to find empty entries. You can also use `en: ''` or `ko: ''` to find missing translations for a language.

To add your translation, fork the repository and edit the files.

### Character Names

When translating character names, note that the Closure Talk app displays only the first name (`short_name`) of characters. The program uses the space in the full name to figure out which part is the first name. Please insert a space between last name and first name.

### Additional Note

Due to how Blue Archive data is organized, there are many entries with missing translations. It's OK if you only have time / interest for just a small portion of them, even just one character. Any help, small or large, are greatly appreciated.
