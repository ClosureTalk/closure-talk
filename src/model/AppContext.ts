import { createContext, useContext } from 'react';
import { RendererConfig } from "../renderer/RendererConfig";
import { RendererType } from "../renderer/RendererType";
import Character from "./Character";
import ChatChar from "./ChatChar";
import { Renderers } from "./Constants";
import DataSourceState from "./DataSourceState";
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
  sources: DataSourceState[];
  setSources: Function;
  rendererConfigs: Map<RendererType, RendererConfig>;
  setRendererConfig: (name: RendererType, value: RendererConfig) => void;
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
  sources: [],
  setSources: () => { },
  rendererConfigs: new Map<RendererType, RendererConfig>(),
  setRendererConfig: () => { },
});

const useAppContext = () => useContext(AppContext);

export { AppContext, useAppContext };
