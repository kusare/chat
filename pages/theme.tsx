import { NextPage } from "next";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack, Button } from "@mui/material";
import React, { useState, useEffect, useContext, useRef } from "react";
import Grid from "@mui/material/Grid";
import { Input } from "@mui/material";
import Head from "next/head";
import { Global, css } from "@emotion/react";
import {
  GetCssMsg,
  GetCssImg,
  useCssMsgs,
  setCssMsg,
  SetCssTextToAtomBtn,
  setCssImg,
  useImgMsgs,
} from "../components/firebase-theme";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cssBackgroundState,
  cssTopbarState,
  cssChatMsgState,
} from "../recoil/cssMsgStates";
import { SketchPicker, ColorResult } from "react-color";
// @ts-ignoree
import { toCSS, toJSON } from "cssjson";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import {
  signIn,
  signOutUser,
  ProfilePic,
  UserName,
  setMsg,
  setImgMsg,
} from "../components/firebase-index";
import GitHubIcon from "@mui/icons-material/GitHub";
import ChatIcon from "@mui/icons-material/Chat";
import Link from "@mui/material/Link";
import PaletteIcon from "@mui/icons-material/Palette";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { CustomDrawer } from "../components/GlobalUi";
import { ThemeUiTargetId, EditThemeCss } from "../components/ThemeParts";

const Page: NextPage = () => {
  /**
██████╗ ███████╗ ██████╗ ██████╗ ██╗██╗     
██╔══██╗██╔════╝██╔════╝██╔═══██╗██║██║     
██████╔╝█████╗  ██║     ██║   ██║██║██║     
██╔══██╗██╔══╝  ██║     ██║   ██║██║██║     
██║  ██║███████╗╚██████╗╚██████╔╝██║███████╗
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝
                                            
 */

  // 全体の背景のCSS設定はcssBackgroundStateから
  const setCssBackgroundState = useSetRecoilState(cssBackgroundState);
  const cssText = useRecoilValue(cssBackgroundState);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssBackgroundState(event.target.value);
  };

  // 全体のtopbarのCSS設定
  const cssTopbar = useRecoilValue(cssTopbarState);
  const setCssTopbarState = useSetRecoilState(cssTopbarState);

  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);
  const setChatMsgState = useSetRecoilState(cssChatMsgState);

  // (props) CSS to Json
  const [cssJson, setCssJson] = useState(toJSON(cssText).attributes);

  // (css) Json to CSS
  const [cssEdited, setCssEdited] = useState(
    toCSS({
      attributes: { ...cssJson },
    })
  );

  /**
 ██████╗ ██████╗ ██╗      ██████╗ ██████╗     ██████╗ ██╗ ██████╗██╗  ██╗███████╗██████╗ 
██╔════╝██╔═══██╗██║     ██╔═══██╗██╔══██╗    ██╔══██╗██║██╔════╝██║ ██╔╝██╔════╝██╔══██╗
██║     ██║   ██║██║     ██║   ██║██████╔╝    ██████╔╝██║██║     █████╔╝ █████╗  ██████╔╝
██║     ██║   ██║██║     ██║   ██║██╔══██╗    ██╔═══╝ ██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
╚██████╗╚██████╔╝███████╗╚██████╔╝██║  ██║    ██║     ██║╚██████╗██║  ██╗███████╗██║  ██║
 ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝    ╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                                                                                         
 */

  // 🎨 COLOR PICKER
  // Alpha値を16進数に変換する処理
  const decimalToHex = (alpha: number) =>
    alpha === 0 ? "00" : Math.round(255 * alpha).toString(16);

  // for colorPicker setting (background-color)
  const [colorPicked, setColorPicked] = useState(cssJson.background);
  // when color picked
  const handleColorPicked = (color: ColorResult) => {
    // "ff0500" + "80"の形式になるように
    const hexCode = `${color.hex}${decimalToHex(color.rgb.a || 0)}`;
    // JSONのCSSに追加
    cssJson.background = hexCode;
    setCssJson(cssJson);
    // 追加したJSONをCSSに変換して(cssEdited) stateに追加
    setCssEdited(
      toCSS({
        attributes: { ...cssJson },
      })
    );
    // ColorPickerの設定を更新
    setColorPicked(hexCode);
    // 全体のCSS設定を更新
    setCssBackgroundState(cssEdited);
  };

  /**
██████╗ ██████╗  █████╗ ██╗    ██╗███████╗██████╗ 
██╔══██╗██╔══██╗██╔══██╗██║    ██║██╔════╝██╔══██╗
██║  ██║██████╔╝███████║██║ █╗ ██║█████╗  ██████╔╝
██║  ██║██╔══██╗██╔══██║██║███╗██║██╔══╝  ██╔══██╗
██████╔╝██║  ██║██║  ██║╚███╔███╔╝███████╗██║  ██║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝
                                                  
 */

  const drawerWidth = 240;

  const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  /**
████████╗ ██████╗  ██████╗  ██████╗ ██╗     ███████╗
╚══██╔══╝██╔═══██╗██╔════╝ ██╔════╝ ██║     ██╔════╝
   ██║   ██║   ██║██║  ███╗██║  ███╗██║     █████╗  
   ██║   ██║   ██║██║   ██║██║   ██║██║     ██╔══╝  
   ██║   ╚██████╔╝╚██████╔╝╚██████╔╝███████╗███████╗
   ╚═╝    ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝
                                                    
 */

  const [alignment, setAlignment] =
    React.useState<ThemeUiTargetId>("background");

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: ThemeUiTargetId
  ) => {
    setAlignment(newAlignment);
  };

  /**
 ██████╗███████╗███████╗    ██╗███╗   ███╗ ██████╗     ███╗   ███╗███████╗ ██████╗ 
██╔════╝██╔════╝██╔════╝    ██║████╗ ████║██╔════╝     ████╗ ████║██╔════╝██╔════╝ 
██║     ███████╗███████╗    ██║██╔████╔██║██║  ███╗    ██╔████╔██║███████╗██║  ███╗
██║     ╚════██║╚════██║    ██║██║╚██╔╝██║██║   ██║    ██║╚██╔╝██║╚════██║██║   ██║
╚██████╗███████║███████║    ██║██║ ╚═╝ ██║╚██████╔╝    ██║ ╚═╝ ██║███████║╚██████╔╝
 ╚═════╝╚══════╝╚══════╝    ╚═╝╚═╝     ╚═╝ ╚═════╝     ╚═╝     ╚═╝╚══════╝ ╚═════╝ 
                                                                                   
 */

  const imgMsgs = useImgMsgs("cssImgMsgs").map((msg, index) => (
    <div key={index.toString() + "div"}>
      {msg && (
        <GetCssImg
          // msg?.id.toString() cannot delete
          key={msg?.id?.toString() + index.toString() + "msg"}
          msg={msg}
        ></GetCssImg>
      )}
    </div>
  ));

  /**
██████╗ ███████╗████████╗██╗   ██╗██████╗ ███╗   ██╗
██╔══██╗██╔════╝╚══██╔══╝██║   ██║██╔══██╗████╗  ██║
██████╔╝█████╗     ██║   ██║   ██║██████╔╝██╔██╗ ██║
██╔══██╗██╔══╝     ██║   ██║   ██║██╔══██╗██║╚██╗██║
██║  ██║███████╗   ██║   ╚██████╔╝██║  ██║██║ ╚████║
╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
                                                    
 */
  return (
    <>
      <Global
        styles={css`
          body {
            ${cssText}
          }
        `}
      />
      <Head>
        <title>Hamu House</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CustomDrawer>
        {/* 
              ████████╗ ██████╗  ██████╗  ██████╗ ██╗     ███████╗
              ╚══██╔══╝██╔═══██╗██╔════╝ ██╔════╝ ██║     ██╔════╝
                 ██║   ██║   ██║██║  ███╗██║  ███╗██║     █████╗  
                 ██║   ██║   ██║██║   ██║██║   ██║██║     ██╔══╝  
                 ██║   ╚██████╔╝╚██████╔╝╚██████╔╝███████╗███████╗
                 ╚═╝    ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝ 
             */}
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleToggle}
        >
          <ToggleButton value="background">Background</ToggleButton>
          <ToggleButton value="topbar">TopBar</ToggleButton>
          <ToggleButton value="message">Message</ToggleButton>
        </ToggleButtonGroup>
        <Grid container direction="row">
          {/* 
                 ██████╗███████╗███████╗
                ██╔════╝██╔════╝██╔════╝
                ██║     ███████╗███████╗
                ██║     ╚════██║╚════██║
                ╚██████╗███████║███████║
                 ╚═════╝╚══════╝╚══════╝

             */}
          <Grid item xs={12} md={6} style={{ minHeight: "100vh" }}>
            <h3>CSS</h3>
            <EditThemeCss id={alignment}></EditThemeCss>

            {/* 
              ██╗███╗   ███╗ █████╗  ██████╗ ███████╗
              ██║████╗ ████║██╔══██╗██╔════╝ ██╔════╝
              ██║██╔████╔██║███████║██║  ███╗█████╗  
              ██║██║╚██╔╝██║██╔══██║██║   ██║██╔══╝  
              ██║██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗
              ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
                                        */}
            <h3>Image</h3>
            {alignment === "background" && (
              <Grid item>
                <Input
                  type="file"
                  onChange={(e) => setCssImg(e, "cssImgMsgs")}
                />

                {/* 
               ██████╗███████╗███████╗    ██╗███╗   ███╗ ██████╗     ███╗   ███╗███████╗ ██████╗ 
              ██╔════╝██╔════╝██╔════╝    ██║████╗ ████║██╔════╝     ████╗ ████║██╔════╝██╔════╝ 
              ██║     ███████╗███████╗    ██║██╔████╔██║██║  ███╗    ██╔████╔██║███████╗██║  ███╗
              ██║     ╚════██║╚════██║    ██║██║╚██╔╝██║██║   ██║    ██║╚██╔╝██║╚════██║██║   ██║
              ╚██████╗███████║███████║    ██║██║ ╚═╝ ██║╚██████╔╝    ██║ ╚═╝ ██║███████║╚██████╔╝
              ╚═════╝╚══════╝╚══════╝    ╚═╝╚═╝     ╚═╝ ╚═════╝     ╚═╝     ╚═╝╚══════╝ ╚═════╝ 
                                                                                   
                  */}
                {imgMsgs}
                <h4>Color</h4>
                <SketchPicker
                  color={colorPicked}
                  onChange={handleColorPicked}
                />
              </Grid>
            )}
          </Grid>

          <Grid item xs={12} md={6} alignItems="center">
            {useCssMsgs("cssMsgs").map((msg, index) => (
              <div key={index.toString() + "div"}>
                <GetCssMsg
                  key={msg?.id?.toString() + index.toString() + "msg"}
                  msg={msg}
                ></GetCssMsg>
                <SetCssTextToAtomBtn
                  key={msg?.id?.toString() + index.toString() + "css"}
                  msg={msg}
                />
              </div>
            ))}
          </Grid>
        </Grid>
      </CustomDrawer>
    </>
  );
};

export default Page;
