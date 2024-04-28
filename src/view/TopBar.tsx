import CodeIcon from '@mui/icons-material/Code';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Box, Button, Dialog, DialogContent, FormControl, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledIconButton } from "../component/StyledIconButton";
import { StyledInputLabel, StyledSelect } from "../component/StyledSelect";
import { useAppContext } from "../model/AppContext";
import ChatItem from "../model/ChatItem";
import { Languages, Renderers } from "../model/Constants";
import { ClearChatEvent, LoadCodeEvent, SaveCodeEvent } from "../model/Events";
import ReleaseNotes from "../model/ReleaseNotes";
import { rendererConfigDialog } from "../renderer/RendererFactory";
import { capture_and_save } from "../utils/CaptureUtils";
import { get_now_filename } from "../utils/DateUtils";
import { wait } from "../utils/PromiseUtils";
import InfoView from "./InfoView";

type BoolFunc = (v: boolean) => void;
const release_notes = require("../release_notes.json") as ReleaseNotes[];

function InfoButtons(setShowInfo: BoolFunc) {
  const { t, i18n } = useTranslation();

  const feedbackUrl = i18n.language.startsWith("zh-") ?
    "https://wj.qq.com/s2/14292312/3ade/" :
    "https://github.com/ClosureTalk/closure-talk/issues";

  return (
    <>
      <StyledIconButton
        title="GitHub"
        onClick={() => window.open("https://github.com/ClosureTalk/closure-talk", "_blank")}
      >
        <GitHubIcon />
      </StyledIconButton>
      <StyledIconButton
        title={t("topbar-show-info")}
        onClick={() => setShowInfo(true)}
      >
        <InfoIcon />
      </StyledIconButton>
      <StyledIconButton
        title={t("topbar-show-help")}
        onClick={() => window.open("https://github.com/ClosureTalk/closure-talk/tree/master/docs/user-guide", "_blank")}
      >
        <HelpOutlineIcon />
      </StyledIconButton>
      <Button
        variant="text"
        sx={{
          color: "white",
        }}
        onClick={() => window.open(feedbackUrl, "_blank")}
      >{t("topbar-feedback")}</Button>
    </>
  );
}

function ChatButtons(setShowRendererConfig: BoolFunc) {
  const ctx = useAppContext();
  const { t } = useTranslation();

  return (
    <>
      <StyledIconButton
        title={t("topbar-config")}
        onClick={() => setShowRendererConfig(true)}
      >
        <SettingsIcon />
      </StyledIconButton>
      <StyledIconButton
        title={t("topbar-save-image")}
        disabled={ctx.isCapturing}
        onClick={() => {
          const chat_groups = ctx.chat.reduceRight((result: ChatItem[][], item) => {
            result[0] = result[0] || [];

            if (item.is_breaking) {
              result.unshift([item]);
            }
            else {
              result[0].unshift(item);
            }

            return result;
          }, []);

          if (chat_groups.length === 1) {
            capture_and_save("chat-area", `closure-talk-${get_now_filename()}.png`);
            return;
          }

          (async () => {
            const name = `closure-talk-${get_now_filename()}`;
            ctx.setIsCapturing(true);

            const saved_chat = ctx.chat;
            for (let i = 0; i < chat_groups.length; ++i) {
              ctx.setChat(chat_groups[i]);
              await wait(1000);
              capture_and_save("chat-area", `${name}-${i.toString().padStart(2, "0")}.png`);
              await wait(1000);
            }

            ctx.setChat(saved_chat);
            ctx.setIsCapturing(false);
          })();
        }}>
        <PhotoCameraIcon />
      </StyledIconButton>
      <StyledIconButton
        title={t("topbar-save-code")}
        onClick={() => { window.dispatchEvent(SaveCodeEvent); }}
      >
        <CodeIcon />
      </StyledIconButton>
      <StyledIconButton
        title={t("topbar-load-code")}
        onClick={() => { window.dispatchEvent(LoadCodeEvent); }}
      >
        <FileUploadIcon />
      </StyledIconButton>
      <StyledIconButton
        title={t("topbar-clear-chat")}
        onClick={() => { window.dispatchEvent(ClearChatEvent); }}
      >
        <DeleteForeverIcon />
      </StyledIconButton>
    </>
  );
}

function AppDropdowns() {
  const ctx = useAppContext();
  const { i18n } = useTranslation();

  return (
    <>
      <FormControl sx={{ width: "100px" }} size="small">
        <StyledInputLabel id="select-lang-label">Lang</StyledInputLabel>
        <StyledSelect
          labelId="select-lang-label"
          id="select-lang"
          value={ctx.lang}
          label="Lang"
          onChange={(ev) => {
            const newLang = ev.target.value as string;
            localStorage.setItem("lang", newLang);
            ctx.setLang(newLang);
            i18n.changeLanguage(newLang);
          }}
        >
          {Languages.map(l => (
            <MenuItem key={l} value={l}>{l}</MenuItem>
          ))}
        </StyledSelect>
      </FormControl>
      <FormControl sx={{ width: "120px" }} size="small">
        <StyledInputLabel id="select-renderer-label">Render</StyledInputLabel>
        <StyledSelect
          labelId="select-renderer-label"
          id="select-renderer"
          value={ctx.renderer}
          label="Render"
          onChange={(ev) => {
            const newRenderer = ev.target.value as string;
            localStorage.setItem("renderer", newRenderer);
            ctx.setRenderer(newRenderer);
          }}
        >
          {Renderers.map(l => (
            <MenuItem key={l} value={l}>{l}</MenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </>
  );
}

export default function TopBar() {
  const ctx = useAppContext();
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(localStorage.getItem("last-viewed-version") !== release_notes[0].version);
  const [showRendererConfig, setShowRendererConfig] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  return (
    <AppBar position="fixed" className="top-bar" elevation={0}>
      <Toolbar disableGutters>
        <Stack direction="row" sx={{
          alignItems: "center",
          marginLeft: "8px",
          columnGap: "8px",
        }}>
          <Typography variant="h5">Closure Talk</Typography>
          <Typography variant="body1" sx={{
            fontStyle: "italic"
          }}>beta</Typography>
          {!ctx.isWideScreen ? null :
            InfoButtons(setShowInfo)
          }
        </Stack>
        <Box sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "row",
          columnGap: "8px",
          justifyContent: "flex-end",
          alignItems: "center",
          marginRight: "8px",
        }}>
          {ctx.isWideScreen ?
            <>
              {AppDropdowns()}
              {ChatButtons(setShowRendererConfig)}
            </> :
            <>
              <StyledIconButton
                title={t("topbar-show-menu")}
                onClick={(ev) => {
                  setMenuAnchor(ev.currentTarget);
                  setShowMenu(true);
                }}
              >
                <MenuIcon />
              </StyledIconButton>
              <StyledIconButton
                title={t("topbar-show-charlist")}
                onClick={() => ctx.setShowCharListOverlay(!ctx.showCharListOverlay)}
              >
                {ctx.showCharListOverlay ?
                  <HowToRegIcon /> :
                  <PersonAddIcon />
                }
              </StyledIconButton>
            </>
          }
        </Box>
        {rendererConfigDialog(ctx.renderer, showRendererConfig, () => { setShowRendererConfig(false); }, ctx.setRendererConfig)}
      </Toolbar>
      {ctx.isWideScreen ? null :
        <Dialog
          open={showMenu}
          onClose={() => setShowMenu(false)}
        >
          <DialogContent>
            <Stack direction="row" spacing={1}>
              {InfoButtons(setShowInfo)}
            </Stack>
            <Stack direction="row" spacing={1}>
              {AppDropdowns()}
            </Stack>
            <Stack direction="row" spacing={1}>
              {ChatButtons(setShowRendererConfig)}
            </Stack>
          </DialogContent>
        </Dialog>
      }
      <Dialog
        open={showInfo}
        onClose={() => {
          setShowInfo(false);
          localStorage.setItem("last-viewed-version", release_notes[0].version);
        }}
      >
        <DialogContent>
          <InfoView />
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}
