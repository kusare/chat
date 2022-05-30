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
import { cssTextState, cssMsgState } from "../recoil/cssMsgStates";
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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
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

const Page: NextPage = () => {
  // 全体のCSS設定はcssTextStateから
  const setCssTextState = useSetRecoilState(cssTextState);
  const cssText = useRecoilValue(cssTextState);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssTextState(event.target.value);
  };

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

  // 背景画像を設定するテスト関数予定地
  const chgBg = () => {
    // JSONのCSSに追加
    cssJson.background = `url('https://firebasestorage.googleapis.com/v0/b/chat-831ad.appspot.com/o/fbSu5m6Qy2ZJLe9Nx5eK3ngYVw83%2FCxFU8wHkoosuaiphxd9v%2Fanimal_okojo_summer.png?alt=media&token=5d678777-3251-48f3-ad09-928de972868b')`;
    setCssJson(cssJson);
    // 追加したJSONをCSSに変換して(cssEdited) stateに追加
    setCssEdited(
      toCSS({
        attributes: { ...cssJson },
      })
    );
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
            background: #acccf8;
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
            <Typography variant="h6" noWrap component="div">
              Hamu House
            </Typography>
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
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
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
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <a href="https://github.com/kusare/chat" target="_self">
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
              </a>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <h1>Theme</h1>
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
              <Stack spacing={2} direction="row">
                <TextField
                  multiline
                  value={cssText}
                  rows={4}
                  onChange={handleChange}
                />
                <Button onClick={() => setCssMsg(cssText)}>Set Msg</Button>
              </Stack>
              <h3>background</h3>
              {/* ██╗███╗   ███╗ █████╗  ██████╗ ███████╗
              ██║████╗ ████║██╔══██╗██╔════╝ ██╔════╝
              ██║██╔████╔██║███████║██║  ███╗█████╗  
              ██║██║╚██╔╝██║██╔══██║██║   ██║██╔══╝  
              ██║██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗
              ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
                                        */}
              <h4>background-image</h4>
              <Grid item>
                <Input
                  type="file"
                  onChange={(e) => setCssImg(e, "cssImgMsgs")}
                />
                {useCssMsgs("cssImgMsgs").map((msg, index) => (
                  <div key={index.toString() + "div"}>
                    <GetCssImg
                      // msg?.id.toString() cannot delete
                      key={msg?.id.toString() + index.toString() + "msg"}
                      msg={msg}
                    ></GetCssImg>
                  </div>
                ))}
                <h4>background-color</h4>
                <SketchPicker
                  color={colorPicked}
                  onChange={handleColorPicked}
                />
              </Grid>
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
