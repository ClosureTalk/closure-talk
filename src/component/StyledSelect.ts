import { InputLabel, Select, styled } from "@mui/material";

export const StyledSelect = styled(Select)({
  color: "inherit"
});

export const StyledInputLabel = styled(InputLabel)({
  color: "inherit",
  "&.Mui-focused": {
    color: "inherit"
  }
});
