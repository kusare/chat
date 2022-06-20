import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";
import theme from "../styles/theme";
import { RecoilRoot } from "recoil";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import "modern-css-reset/dist/reset.min.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </RecoilRoot>
  );
}
