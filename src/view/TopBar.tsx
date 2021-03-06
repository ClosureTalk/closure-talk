import CodeIcon from '@mui/icons-material/Code';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { AppBar, Box, Dialog, DialogContent, DialogContentText, FormControl, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledIconButton } from "../component/StyledIconButton";
import { StyledInputLabel, StyledSelect } from "../component/StyledSelect";
import { useAppContext } from "../model/AppContext";
import { Languages, Renderers } from "../model/Constants";
import { ClearChatEvent, LoadCodeEvent, SaveCodeEvent } from "../model/Events";
import { capture_and_save } from "../utils/CaptureUtils";
import { get_now_filename } from "../utils/DateUtils";
import InfoView from "./InfoView";

export default function TopBar() {
  const ctx = useAppContext();
  const { t, i18n } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
          <StyledIconButton
            title="GitHub"
            onClick={() => window.open("https://github.com/ClosureTalk/closure-talk", "_blank")}
          >
            <GitHubIcon />
          </StyledIconButton>
          <StyledIconButton
            title={t("Show info")}
            onClick={() => setShowInfo(true)}
          >
            <InfoIcon />
          </StyledIconButton>
          <StyledIconButton
            title={t("Show help")}
            onClick={() => setShowHelp(true)}
          >
            <HelpOutlineIcon />
          </StyledIconButton>
          <StyledIconButton
            title={t("Save image")}
            onClick={() => { capture_and_save("chat-area", `closure-talk-${get_now_filename()}.png`); }}>
            <PhotoCameraIcon />
          </StyledIconButton>
          <StyledIconButton
            title={t("Save code")}
            onClick={() => { window.dispatchEvent(SaveCodeEvent); }}
          >
            <CodeIcon />
          </StyledIconButton>
          <StyledIconButton
            title={t("Load code")}
            onClick={() => { window.dispatchEvent(LoadCodeEvent); }}
          >
            <FileUploadIcon />
          </StyledIconButton>
          <StyledIconButton
            title={t("Clear chat")}
            onClick={() => { window.dispatchEvent(ClearChatEvent); }}
          >
            <DeleteForeverIcon />
          </StyledIconButton>
        </Box>
      </Toolbar>
      <Dialog
        open={showHelp}
        onClose={() => { setShowHelp(false); }}
      >
        <DialogContent>
          <DialogContentText sx={{
            whiteSpace: "pre-line"
          }}>{t("Help text")}</DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showInfo}
        onClose={() => { setShowInfo(false); }}
      >
        <DialogContent>
          <InfoView />
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}
