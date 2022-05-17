import { createTheme } from "@mui/material/styles";
import { blue, red } from "@mui/material/colors";

// Create a theme instance.
const theme2 = createTheme({
  palette: {
    primary: {
      main: red[100],
    },
    secondary: {
      main: "#19857b",
    },
    background: {
      default: blue[900],
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: "3px solid black",
        },
      },
    },
  },
});

export default theme2;
