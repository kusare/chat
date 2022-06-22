import { NextPage } from "next";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack, Button, SwipeableDrawer } from "@mui/material";
import React, { useState, useEffect, useContext, useRef } from "react";
import Grid from "@mui/material/Grid";
import { Input } from "@mui/material";
import Head from "next/head";
import { Global, css } from "@emotion/react";
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
import { ProfilePic } from "./ChatFirebase";
import GitHubIcon from "@mui/icons-material/GitHub";
import ChatIcon from "@mui/icons-material/Chat";
import Link from "@mui/material/Link";
import PaletteIcon from "@mui/icons-material/Palette";
import { cssTopbarState, cssTopbarDecoState } from "../recoil/States";
import {
  atom,
  useGetRecoilValueInfo_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TimerIcon from "@mui/icons-material/Timer";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useRouter } from "next/router";
import AppBar from "@mui/material/AppBar";
import ForumTwoToneIcon from "@mui/icons-material/ForumTwoTone";
import SearchIcon from "@mui/icons-material/Search";

const SideListUp: React.FC<{
  open: Boolean;
}> = (props) => {
  const { open } = props;
  const list = [
    {
      linkKey: "thread",
      href: "/thread",
      text: "Thread",
      icon: <ForumTwoToneIcon />,
    },
    { linkKey: "chat", href: "/chat", text: "Chat", icon: <ChatIcon /> },
    { linkKey: "theme", href: "/theme", text: "Theme", icon: <PaletteIcon /> },
    {
      linkKey: "reader",
      href: "/reader",
      text: "RSS Reader",
      icon: <SettingsInputAntennaIcon />,
    },
    {
      linkKey: "money",
      href: "/money",
      text: "Money",
      icon: <CreditCardIcon />,
    },
    {
      linkKey: "timer",
      href: "/timer",
      text: "Timer",
      icon: <TimerIcon />,
    },
    {
      linkKey: "sound",
      href: "/sound",
      text: "Sound",
      icon: <MusicNoteOutlinedIcon />,
    },
    {
      linkKey: "search",
      href: "/search",
      text: "Search",
      icon: <SearchIcon />,
    },
  ];

  const content = list.map((value, index) => (
    <SideList
      key={index}
      open={open}
      linkKey={value.linkKey}
      href={value.href}
      text={value.text}
      icon={value.icon}
    ></SideList>
  ));
  return <>{content}</>;
};

const SideList: React.FC<{
  open: Boolean;
  linkKey: string;
  href: string;
  text: string;
  icon: any;
}> = (props) => {
  const { open, linkKey, href, text, icon } = props;

  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        <Link
          noWrap
          // key={"chat"}
          key={linkKey}
          // href={"/chat"}
          href={href}
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
              {icon}
            </ListItemIcon>
            <ListItemText
              // primary={"Chat"}
              primary={text}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </Link>
      </ListItem>
    </>
  );
};

export const CustomDrawer: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  /**
██████╗ ███████╗ ██████╗ ██████╗ ██╗██╗     
██╔══██╗██╔════╝██╔════╝██╔═══██╗██║██║     
██████╔╝█████╗  ██║     ██║   ██║██║██║     
██╔══██╗██╔══╝  ██║     ██║   ██║██║██║     
██║  ██║███████╗╚██████╗╚██████╔╝██║███████╗
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝
                                            
 */

  // 全体のtopbarのCSS設定
  const cssTopbar = useRecoilValue(cssTopbarState);
  const cssTopbarDeco = useRecoilValue(cssTopbarDecoState);

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

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" open={open} color="transparent" elevation={0}>
          <Toolbar
            css={css`
              ${cssTopbar}
            `}
          >
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
              noWrap
              key={"chat"}
              // variant="body2"
              href={"/"}
              // sx={{ p: 1, flexShrink: 0 }}
              underline="none"
            >
              <p>Hamu House</p>
            </Link>
            <ProfilePic></ProfilePic>
          </Toolbar>
          <p
            css={css`
              ${cssTopbarDeco}
            `}
          >
            {`cssTopbarDeco`}
          </p>
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
          {/*           
          ██████╗ ██╗ ██████╗ ██╗  ██╗████████╗    ███████╗██╗██████╗ ███████╗
          ██╔══██╗██║██╔════╝ ██║  ██║╚══██╔══╝    ██╔════╝██║██╔══██╗██╔════╝
          ██████╔╝██║██║  ███╗███████║   ██║       ███████╗██║██║  ██║█████╗  
          ██╔══██╗██║██║   ██║██╔══██║   ██║       ╚════██║██║██║  ██║██╔══╝  
          ██║  ██║██║╚██████╔╝██║  ██║   ██║       ███████║██║██████╔╝███████╗
          ╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚══════╝╚═╝╚═════╝ ╚══════╝
                                                                     */}
          <List>
            <SideListUp open={open}></SideListUp>
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
 ██████╗██╗  ██╗██╗██╗     ██████╗ ██████╗ ███████╗███╗   ██╗
██╔════╝██║  ██║██║██║     ██╔══██╗██╔══██╗██╔════╝████╗  ██║
██║     ███████║██║██║     ██║  ██║██████╔╝█████╗  ██╔██╗ ██║
██║     ██╔══██║██║██║     ██║  ██║██╔══██╗██╔══╝  ██║╚██╗██║
╚██████╗██║  ██║██║███████╗██████╔╝██║  ██║███████╗██║ ╚████║
 ╚═════╝╚═╝  ╚═╝╚═╝╚══════╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
                                                              */}

          {props.children}
        </Box>
      </Box>
    </div>
  );
};
export const SwipeableTemporaryDrawer: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  /**
██████╗ ███████╗ ██████╗ ██████╗ ██╗██╗     
██╔══██╗██╔════╝██╔════╝██╔═══██╗██║██║     
██████╔╝█████╗  ██║     ██║   ██║██║██║     
██╔══██╗██╔══╝  ██║     ██║   ██║██║██║     
██║  ██║███████╗╚██████╗╚██████╔╝██║███████╗
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝
                                            
 */

  // 全体のtopbarのCSS設定
  const cssTopbar = useRecoilValue(cssTopbarState);
  const cssTopbarDeco = useRecoilValue(cssTopbarDecoState);

  /**
██████╗ ██████╗  █████╗ ██╗    ██╗███████╗██████╗ 
██╔══██╗██╔══██╗██╔══██╗██║    ██║██╔════╝██╔══██╗
██║  ██║██████╔╝███████║██║ █╗ ██║█████╗  ██████╔╝
██║  ██║██╔══██╗██╔══██║██║███╗██║██╔══╝  ██╔══██╗
██████╔╝██║  ██║██║  ██║╚███╔███╔╝███████╗██║  ██║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝
                                                  
 */
  // const drawerWidth = 0;

  // interface AppBarProps extends MuiAppBarProps {
  //   open?: boolean;
  // }

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  // const AppBar = styled(MuiAppBar, {
  //   shouldForwardProp: (prop) => prop !== "open",
  // })<AppBarProps>(({ theme, open }) => ({
  //   zIndex: theme.zIndex.drawer + 1,
  //   ...(open && {}),
  // }));

  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Toolbar
        css={css`
          ${cssTopbar}
        `}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        <Link
          noWrap
          key={"root"}
          // variant="body2"
          href={"/"}
          // sx={{ p: 1, flexShrink: 0 }}
          underline="none"
        >
          <p>Hamu House</p>
        </Link>
        <ProfilePic></ProfilePic>
      </Toolbar>
      <p
        css={css`
          ${cssTopbarDeco}
        `}
      >
        {`cssTopbarDeco`}
      </p>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => {}}
      >
        <Toolbar
          css={css`
            ${cssTopbar}
          `}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(false)}
          >
            <MenuIcon />
          </IconButton>
          <Link
            noWrap
            key={"chat"}
            // variant="body2"
            href={"/"}
            // sx={{ p: 1, flexShrink: 0 }}
            underline="none"
          >
            <p>Hamu House</p>
          </Link>
          <ProfilePic></ProfilePic>

          {/* <IconButton
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
          </IconButton> */}
        </Toolbar>
        <div>
          <Box textAlign="center" p={2}>
            {/*           
          ██████╗ ██╗ ██████╗ ██╗  ██╗████████╗    ███████╗██╗██████╗ ███████╗
          ██╔══██╗██║██╔════╝ ██║  ██║╚══██╔══╝    ██╔════╝██║██╔══██╗██╔════╝
          ██████╔╝██║██║  ███╗███████║   ██║       ███████╗██║██║  ██║█████╗  
          ██╔══██╗██║██║   ██║██╔══██║   ██║       ╚════██║██║██║  ██║██╔══╝  
          ██║  ██║██║╚██████╔╝██║  ██║   ██║       ███████║██║██████╔╝███████╗
          ╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚══════╝╚═╝╚═════╝ ╚══════╝
                                                                     */}
            <List>
              <SideListUp open={open}></SideListUp>
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
          </Box>
          <Divider />
        </div>
      </SwipeableDrawer>
      {props.children}
    </>
  );
};
