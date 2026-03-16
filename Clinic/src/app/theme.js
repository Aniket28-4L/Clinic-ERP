import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2E5BFF" },
    secondary: { main: "#0EA5E9" },
    background: { default: "#F6F7FB", paper: "#FFFFFF" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['"Segoe UI"', "system-ui", "-apple-system", "sans-serif"].join(","),
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
  },
});

