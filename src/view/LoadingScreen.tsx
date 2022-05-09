import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function LoadingScreen() {
  return (
    <Box sx={{
      width: "100vh",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#424242",
      color: "#d6d6d6",
    }}>
      <Typography variant="h1">Closure Talk</Typography>
    </Box>
  );
}
