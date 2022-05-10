import { Box, Button, IconButton, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import VFill from "../component/VFill";
import { useAppContext } from "../model/AppContext";
import AppData from "../model/AppData";
import Character from "../model/Character";
import ChatChar from "../model/ChatChar";
import { DataSources } from "../model/Constants";

class CharListProps {
  data = new AppData();
}

function applySearch(chars: Character[], search: string, sources: string[]): Character[] {
  const keys = search.split(",").map(s => s.trim().toLowerCase());
  const result = chars.filter(
    ch => sources.some(s => s === ch.ds.key)
  ).filter(
    ch => keys.every(key => ch.all_search.includes(key))
  );

  return result;
}

export default function CharList(props: CharListProps) {
  const ctx = useAppContext();
  const [search, setSearch] = useState("");
  const [sources, setSources] = useState(DataSources.map(s => s.key));
  const [displayedChars, setDisplayedChars] = useState<Character[]>([]);

  useEffect(() => {
    setDisplayedChars(applySearch(props.data.ordered_characters, search, sources));
  }, [props.data.ordered_characters, search, sources]);

  const makeAvatar = (ch: Character, img: string) => {
    return (
      <IconButton sx={{ padding: 0 }} key={img} onClick={() => {
        const chatCh = new ChatChar(ch, img);
        const idx = ctx.activeChars.findIndex(c => c.get_id() === chatCh.get_id());
        if (idx < 0) {
          ctx.setActiveChars([...ctx.activeChars, chatCh]);
        }
      }}>
        <Avatar
          src={ch.get_url(img)}
          alt={`Avatar of ${ch.get_short_name("en")}`}
          sx={{ width: "64px", height: "64px" }}
        />
      </IconButton>
    );
  };

  const renderRow = (rp: ListChildComponentProps<Character>) => {
    const ch = displayedChars[rp.index];
    return (
      <ListItem style={rp.style} key={ch.id} className="char-list-item">
        <ListItemText
          primary={<Stack direction="row" spacing={1}>
            {ch.images.map(img => makeAvatar(ch, img))}
          </Stack>}
        />
        <Typography variant="h6">{ch.get_name(ctx.lang)}</Typography>
      </ListItem>
    );
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      <Stack spacing={2} sx={{
        padding: "8px",
      }}>
        <Stack direction="row" spacing={1}>
          {DataSources.map(ds => (
            <Button
              key={ds.key}
              variant="outlined"
              color={sources.includes(ds.key) ? "success" : "error"}
              onClick={_ => {
                const idx = sources.indexOf(ds.key);
                const updated = [...sources];
                if (idx >= 0) {
                  updated.splice(idx, 1);
                }
                else {
                  updated.push(ds.key);
                }
                setSources(updated);
              }}
            >{ds.name}</Button>
          ))}
        </Stack>
        <TextField variant="outlined" label="Search" onChange={ev => setSearch(ev.target.value)}></TextField>
      </Stack>
      <VFill renderer={(height) => {
        return (
          <FixedSizeList
            height={height}
            width={"100%"}
            itemSize={80}
            itemCount={displayedChars.length}
          >
            {renderRow}
          </FixedSizeList>
        );
      }} />
    </Box>
  );
}
