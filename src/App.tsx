import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import "./App.css";
import { AppContext } from "./model/AppContext";
import AppData from "./model/AppData";
import Character from "./model/Character";
import ChatChar from "./model/ChatChar";
import { Renderers } from "./model/Constants";
import DataSourceState from "./model/DataSourceState";
import StampInfo from "./model/StampInfo";
import { RendererType } from "./renderer/RendererType";
import { load_local_storage_chat } from "./utils/ChatUtils";
import CharList from "./view/CharList";
import ChatView from "./view/ChatView";
import LoadingScreen from "./view/LoadingScreen";
import TopBar from "./view/TopBar";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [renderer, setRenderer] = useState((localStorage.getItem("renderer") || Renderers[0]) as RendererType);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "zh-cn");
  const [activeChars, setActiveChars] = useState<ChatChar[]>([]);
  const [characters, setCharacters] = useState(new Map<string, Character>());
  const [stamps, setStamps] = useState<StampInfo[][]>([]);
  const [sources, setSources] = useState<DataSourceState[]>([]);

  useEffect(() => {
    if (loaded) {
      return;
    }

    (async () => {
      const data = await AppData.load_data();
      setCharacters(data.characters);
      setStamps(data.stamps);
      setLoaded(true);
      setActiveChars(load_local_storage_chat(data.characters)[1]);
      setSources(data.sources);
    })();
  }, [loaded]);

  if (!loaded) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <AppContext.Provider value={{
      lang: lang,
      setLang: setLang,
      renderer: renderer,
      setRenderer: setRenderer,
      activeChars: activeChars,
      setActiveChars: setActiveChars,
      characters: characters,
      setCharacters: setCharacters,
      stamps: stamps,
      sources: sources,
      setSources: setSources,
    }}>
      <Box>
        <TopBar />

        <Box sx={{
          position: "fixed",
          top: "64px",
          bottom: "0",
          width: "100vw",
          display: "flex",
        }}>
          <Box sx={{
            flexGrow: 1,
            height: "100%",
            backgroundColor: "#dddddd",
          }}>
            <CharList />
          </Box>
          <Box sx={{
            flexShrink: "0",
            flexBasis: "500px",
            height: "100%",
          }}>
            <ChatView />
          </Box>
        </Box>
      </Box>
    </AppContext.Provider>
  );
}

export default App;
