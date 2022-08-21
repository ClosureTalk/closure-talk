import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import VFill from "../component/VFill";
import { useAppContext } from "../model/AppContext";
import Character from "../model/Character";
import ChatChar from "../model/ChatChar";
import DataSourceState from "../model/DataSourceState";

function applySearch(chars: Character[], search: string, sources: DataSourceState[]): Character[] {
  const keys = search.split(",").map(s => s.trim().toLowerCase());
  const result = chars.filter(
    ch => sources.find(s => s.enabled && s.source.key === ch.ds.key && s.source.filter(ch, s.filters))
  ).filter(
    ch => keys.every(key => ch.all_search.includes(key))
  );

  return result;
}

export default function CharList() {
  const ctx = useAppContext();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [displayedChars, setDisplayedChars] = useState<Character[]>([]);
  const [editingSourceKey, setEditingSourceKey] = useState("");

  useEffect(() => {
    const characters = Array.from(ctx.characters.values());
    const filtered = applySearch(characters, search, ctx.sources);
    const sorted = filtered.sort((a, b) => a.id.localeCompare(b.id));
    setDisplayedChars(sorted);
  }, [ctx.characters, search, ctx.sources]);

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

  const editing = ctx.sources.find(s => s.source.key === editingSourceKey);
  const updateEditing = (action: (copy: DataSourceState) => void) => {
    const copy = new DataSourceState(editing!.source, editing!.filters);
    Object.assign(copy, editing);
    action(copy);
    ctx.setSources(ctx.sources.map(v => v.source.key === copy.source.key ? copy : v));
    copy.save_state();
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
          {ctx.sources.map(ds => (
            <Button
              key={ds.source.key}
              variant="outlined"
              color={editingSourceKey === ds.source.key ? "secondary" : (ds.enabled ? "success" : "error")}
              onClick={_ => {
                if (editingSourceKey === ds.source.key) {
                  setEditingSourceKey("");
                }
                else {
                  setEditingSourceKey(ds.source.key);
                }
              }}
            >{ds.source.name}</Button>
          ))}
        </Stack>
        {
          !editing ? null :
            <Stack direction="column" spacing={1} style={{
              borderStyle: "solid",
              borderColor: "gray",
              borderRadius: "4px",
              borderWidth: "1px",
              padding: "8px",
            }}>
              <FormGroup>
                <FormControlLabel control={
                  <Checkbox
                    checked={editing.enabled}
                    onChange={() => {
                      updateEditing(copy => copy.enabled = !copy.enabled);
                    }}
                  />
                } label={t("source-enabled")} />
              </FormGroup>
              {editing.filters.map((gp, gp_idx) => (
                <Stack direction="column" key={gp.group_key}>
                  <Typography variant="h6">{editing.source.get_string(gp.group_name, ctx.lang)}</Typography>
                  <Stack direction="row" spacing={1} style={{
                    flexWrap: "wrap",
                    maxWidth: "100%",
                  }}>
                    {Array.from(Array(gp.filter_names.length).keys()).map(idx => (
                      <FormGroup key={idx}>
                        <FormControlLabel control={
                          <Checkbox
                            checked={gp.active[idx]}
                            onChange={() => {
                              updateEditing(copy => copy.filters[gp_idx].active[idx] = !gp.active[idx]);
                            }}
                          />
                        } label={editing.source.get_string(gp.filter_names[idx], ctx.lang)} />
                      </FormGroup>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
        }
        <TextField variant="outlined" label={t("search-label")} onChange={ev => setSearch(ev.target.value)}></TextField>
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
