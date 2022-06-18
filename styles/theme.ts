import { createTheme } from "@mui/material/styles";
import { green, pink, red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    // primary: {
    //   main: red[800],
    // },
    // secondary: {
    //   main: "#19857b",
    // },
    background: {
      default: "",
      // default: pink[300],
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "2em",
        },
      },
    },
  },
});
export default theme;
