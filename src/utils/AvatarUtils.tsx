import { Avatar } from "@mui/material";
import ChatChar from "../model/ChatChar";

export function GetPlayerAvatar() {
  return (<Avatar alt="Avatar of player" />);
}

export function GetCharAvatar(char: ChatChar) {
  return (<Avatar src={char.character.get_url(char.img)} alt={`Avatar of ${char.character.get_short_name("en")}`} />);
}
