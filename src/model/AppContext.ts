import { createContext, useContext } from 'react';
import { RendererType } from "../renderer/RendererType";
import Character from "./Character";
import ChatChar from "./ChatChar";
import { Renderers } from "./Constants";
import StampInfo from "./StampInfo";

export interface IAppContext {
  lang: string;
  setLang: Function;
  renderer: RendererType;
  setRenderer: Function;
  activeChars: ChatChar[];
  setActiveChars: Function;
  characters: Map<string, Character>;
  setCharacters: Function;
  stamps: StampInfo[][];
}

const AppContext = createContext<IAppContext>({
  lang: "zh-cn",
  renderer: Renderers[0],
  setLang: () => { },
  setRenderer: () => { },
  activeChars: [],
  setActiveChars: () => { },
  characters: new Map<string, Character>(),
  setCharacters: () => { },
  stamps: [],
});

const useAppContext = () => useContext(AppContext);

export { AppContext, useAppContext };
