import Character from "./Character";

export default class ChatChar {
  character: Character;
  img: string;

  constructor(character: Character, img: string) {
    this.character = character;
    this.img = img;
  }

  get_id(): string {
    return `${this.character.id}-${this.img}`;
  }
}
