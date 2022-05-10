import { Stack, Typography } from "@mui/material";

export default function InfoView() {
  const link = (title: string, url: string) => (
    <a href={url} target="_blank" rel="noreferrer">{title}</a>
  );

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Closure Talk</Typography>
      <Typography variant="body1">More information can be found on {link("Project Homepage", "https://github.com/ClosureTalk/closure-talk")}.</Typography>
      <Typography variant="h6">Credits &amp; Copyrights</Typography>
      <Typography variant="body1">
        This project is inspired by {link("Yuzutalk", "https://www.yuzutalk.net/")}, and the Yuzutalk-style renderer is taken from their website.
      </Typography>
      <Typography variant="body1">
        Character data sources:
        Arknights from {link("Kengxxiao/ArknightsGameData", "https://github.com/Kengxxiao/ArknightsGameData")}.
        Blue Archive from {link("YuzuTalk/translation", "https://github.com/YuzuTalk/translation")}.
      </Typography>
      <Typography variant="body1">
        Arknights avatar copyrights belong to {link("HyperGryph", "https://ak.hypergryph.com/")}; Blue Archive avatar and stamp copyrights belong to {link("Yostar & NEXON Games", "https://bluearchive.jp/")}.
      </Typography>
    </Stack>
  );
}
