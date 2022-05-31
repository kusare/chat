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
} from "./ThemeFirebase";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cssBackgroundState,
  cssTopbarState,
  cssChatMsgState,
} from "../recoil/cssMsgStates";
import { SketchPicker, ColorResult } from "react-color";
// @ts-ignoree
import { toCSS, toJSON } from "cssjson";

export type ThemeUiTargetId = "background" | "topbar" | "message";

export const EditThemeCss: React.FC<{ id: ThemeUiTargetId }> = (props) => {
  /**
██╗███╗   ██╗██╗████████╗
██║████╗  ██║██║╚══██╔══╝
██║██╔██╗ ██║██║   ██║   
██║██║╚██╗██║██║   ██║   
██║██║ ╚████║██║   ██║   
╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   
                         
 */

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
  const cssBackground = useRecoilValue(cssBackgroundState);
  const handleCssBackground = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssBackgroundState(event.target.value);
  };

  // 全体のtopbarのCSS設定
  const cssTopbar = useRecoilValue(cssTopbarState);
  const setCssTopbarState = useSetRecoilState(cssTopbarState);
  const handleCssTopbar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssTopbarState(event.target.value);
  };

  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);
  const setCssChatMsgState = useSetRecoilState(cssChatMsgState);
  const handleCssChatMsg = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssChatMsgState(event.target.value);
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
      {props.id === "background" && (
        <Stack spacing={2} direction="row">
          <TextField
            multiline
            value={cssBackground}
            rows={4}
            onChange={handleCssBackground}
          />
          <Button onClick={() => setCssMsg(cssBackground)}>Set Msg</Button>
        </Stack>
      )}

      {props.id === "topbar" && (
        <Stack spacing={2} direction="row">
          <TextField
            multiline
            value={cssTopbar}
            rows={4}
            onChange={handleCssTopbar}
          />
          <Button onClick={() => setCssMsg(cssTopbar)}>Set Msg</Button>
        </Stack>
      )}

      {props.id === "message" && (
        <Stack spacing={2} direction="row">
          <TextField
            multiline
            value={cssChatMsg}
            rows={4}
            onChange={handleCssChatMsg}
          />
          <Button onClick={() => setCssMsg(cssChatMsg)}>Set Msg</Button>
        </Stack>
      )}
    </>
  );
};
