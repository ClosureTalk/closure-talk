import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import "./App.css";
import { AppContext } from "./model/AppContext";
import AppData from "./model/AppData";
import ChatChar from "./model/ChatChar";
import { Renderers } from "./model/Constants";
import { RendererType } from "./renderer/RendererType";
import { load_local_storage_chat } from "./utils/ChatUtils";
import CharList from "./view/CharList";
import ChatView from "./view/ChatView";
import LoadingScreen from "./view/LoadingScreen";
import TopBar from "./view/TopBar";

function App() {
  const [data, setData] = useState<AppData|null>(null);
  const [renderer, setRenderer] = useState((localStorage.getItem("renderer") || Renderers[0]) as RendererType);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "zh-cn");
  const [activeChars, setActiveChars] = useState<ChatChar[]>([]);

  useEffect(() => {
    if (data === null) {
      (async () => {
        const loaded = await AppData.load_data();
        setData(loaded);
        setActiveChars(load_local_storage_chat(loaded.characters)[1]);
      })();
    }
  }, []);

  if (data === null) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <AppContext.Provider value={{
      lang: lang,
      setLang: setLang,
      renderer: renderer,
      setRenderer: setRenderer,
      activeChars: activeChars,
      setActiveChars: setActiveChars,
      data: data,
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
          <CharList data={data} />
        </Box>
        <Box sx={{
          width: "500px",
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
