import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "../styles/globals.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1d4ed8",
    },
    secondary: {
      main: "#7c3aed",
    },
    background: {
      default: "#f4f7fb",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
