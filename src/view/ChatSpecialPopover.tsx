import { Box, IconButton, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useAppContext } from "../model/AppContext";
import { useState } from "react";
import { prompt_file, read_file_as_url } from "../utils/FileUtils";
import StarsIcon from '@mui/icons-material/Stars';

class ChatSpecialPopoverProps {
  addImage = (url: string) => { };
  addSpecial = () => { };
  closePopover = () => { };
}

export default function ChatSpecialPopover(props: ChatSpecialPopoverProps) {
  const ctx = useAppContext();
  const stampLists = ctx.data.stamps.filter(l => l.length > 0);
  const [stampListIdx, setStampListIdx] = useState(0);

  return (
    <Stack direction="column" sx={{
      width: "300px",
      padding: "12px",
    }}>
      <Box sx={{
        height: "200px",
        overflow: "scroll",
        columnGap: "2px",
      }}>
        {stampLists.length === 0 ? null :
        stampLists[stampListIdx].map(st => (
          <img
            key={st.key}
            className="stamp-btn"
            src={st.url}
            onClick={() => {
              props.addImage(st.url);
              props.closePopover();
            }}></img>
        ))
        }
      </Box>
      <Stack direction="row" sx={{
        paddingTop: "4px",
        columnGap: "4px",
      }}>
        <IconButton onClick={() => props.addSpecial()}>
          <StarsIcon />
        </IconButton>
        <IconButton onClick={async () => {
          const file = await prompt_file("image/*");
          if (file === null) {
            return;
          }

          try {
            const url = await read_file_as_url(file);
            props.addImage(url);
            props.closePopover();
          }
          catch (ex) {
            console.error(ex);
          }
        }}>
          <AddPhotoAlternateIcon />
        </IconButton>
        {stampLists.length === 0 ? null :
          <ToggleButtonGroup
            value={stampListIdx}
            exclusive
            onChange={(_, value: number) => value !== null && setStampListIdx(value)}
          >
            {stampLists.map((list, idx) => (
              <ToggleButton
                value={idx}
                sx={{paddingTop: "0", paddingBottom: "0"}}>
                  {list[0].ds.key}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
      </Stack>
    </Stack>
  );
}
