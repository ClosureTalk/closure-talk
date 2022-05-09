import { createContext, useContext } from 'react';
import { RendererType } from "../renderer/RendererType";
import AppData from "./AppData";
import ChatChar from "./ChatChar";
import { Renderers } from "./Constants";

interface IAppContext {
  lang: string;
  setLang: Function;
  renderer: RendererType;
  setRenderer: Function;
  activeChars: ChatChar[];
  setActiveChars: Function;
  data: AppData;
}

const AppContext = createContext<IAppContext>({
  lang: "zh-cn",
  renderer: Renderers[0],
  setLang: () => { },
  setRenderer: () => { },
  activeChars: [],
  setActiveChars: () => { },
  data: new AppData(),
});

const useAppContext = () => useContext(AppContext);

export { AppContext, useAppContext };
