import { NextPage } from "next";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack, Button } from "@mui/material";
import React, { useState, useEffect, useContext, useRef } from "react";
import Grid from "@mui/material/Grid";
import { Input } from "@mui/material";
import Head from "next/head";
import Header from "../components/Header";
import { Global, css } from "@emotion/react";
import {
  GetCssMsg,
  GetCssImg,
  useCssMsgs,
  setCssMsg,
  SetCssTextToAtomBtn,
  setCssImg,
} from "../components/firebase-theme";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cssTextState,
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

const Page: NextPage = () => {
  // 全体の背景のCSS設定はcssTextStateから
  const setCssTextState = useSetRecoilState(cssTextState);
  const cssText = useRecoilValue(cssTextState);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssTextState(event.target.value);
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
    setCssTextState(cssEdited);
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

  const [alignment, setAlignment] = React.useState("background");

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
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

  const cssMsg = useCssMsgs("cssImgMsgs").map((msg, index) => (
    <div key={index.toString() + "div"}>
      <GetCssImg
        // msg?.id.toString() cannot delete
        key={msg?.id.toString() + index.toString() + "msg"}
        msg={msg}
      ></GetCssImg>
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

      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          open={open}
          css={css`
            background: #d4e4ff;
          `}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Link
              color="inherit"
              noWrap
              key={"chat"}
              // variant="body2"
              href={"/"}
              // sx={{ p: 1, flexShrink: 0 }}
            >
              <Typography variant="h6" noWrap component="div">
                Hamu House
              </Typography>
            </Link>
            <ProfilePic></ProfilePic>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <Link
                // color="inherit"
                noWrap
                key={"chat"}
                // variant="body2"
                href={"/"}
                // sx={{ p: 1, flexShrink: 0 }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <ChatIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Chat"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <Link
                // color="inherit"
                noWrap
                key={"theme"}
                // variant="body2"
                href={"/theme"}
                // sx={{ p: 1, flexShrink: 0 }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <PaletteIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Theme"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <Link
                // color="inherit"
                noWrap
                key={"github"}
                // variant="body2"
                href={"https://github.com/kusare/chat"}
                // sx={{ p: 1, flexShrink: 0 }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <GitHubIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={"GitHub"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
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
            {/* ███████╗██╗  ██╗███████╗███████╗████████╗
                ██╔════╝██║  ██║██╔════╝██╔════╝╚══██╔══╝
                ███████╗███████║█████╗  █████╗     ██║   
                ╚════██║██╔══██║██╔══╝  ██╔══╝     ██║   
                ███████║██║  ██║███████╗███████╗   ██║   
                ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   
             */}
            <Grid item xs={12} md={6} style={{ minHeight: "100vh" }}>
              <h2>Sheet</h2>
              {alignment === "background" && (
                <Stack spacing={2} direction="row">
                  <TextField
                    multiline
                    value={cssText}
                    rows={4}
                    onChange={handleChange}
                  />
                  <Button onClick={() => setCssMsg(cssText)}>Set Msg</Button>
                </Stack>
              )}

              {alignment === "topbar" && (
                <Stack spacing={2} direction="row">
                  <TextField
                    multiline
                    value={cssTopbar}
                    rows={4}
                    onChange={handleChange}
                  />
                  <Button onClick={() => setCssMsg(cssTopbar)}>Set Msg</Button>
                </Stack>
              )}

              {alignment === "message" && (
                <Stack spacing={2} direction="row">
                  <TextField
                    multiline
                    value={cssChatMsg}
                    rows={4}
                    onChange={handleChange}
                  />
                  <Button onClick={() => setCssMsg(cssChatMsg)}>Set Msg</Button>
                </Stack>
              )}

              <h3>background</h3>
              {/* 
              ██╗███╗   ███╗ █████╗  ██████╗ ███████╗
              ██║████╗ ████║██╔══██╗██╔════╝ ██╔════╝
              ██║██╔████╔██║███████║██║  ███╗█████╗  
              ██║██║╚██╔╝██║██╔══██║██║   ██║██╔══╝  
              ██║██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗
              ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
                                        */}
              <h4>Image</h4>
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
                  {cssMsg}
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
                    // msg?.id.toString() cannot delete
                    key={msg?.id.toString() + index.toString() + "msg"}
                    msg={msg}
                  ></GetCssMsg>
                  <SetCssTextToAtomBtn
                    key={msg?.id.toString() + index.toString() + "css"}
                    msg={msg}
                  />
                </div>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Page;
