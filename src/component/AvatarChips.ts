import { Chip } from "@mui/material";
import { styled } from "@mui/system";

export const LargeChip = styled(Chip)(() => ({
  width: "92px",
  height: "60px",
  "& .MuiChip-avatar": {
    width: "48px",
    height: "48px",
  }
}));

export const PlayerChip = styled(LargeChip)(() => ({
  width: "60px",
  "& .MuiChip-avatar": {
    margin: "0",
  },
  "& .MuiChip-label": {
    padding: "0",
  }
}));
