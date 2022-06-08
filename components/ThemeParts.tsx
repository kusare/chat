import { NextPage } from "next";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack, Button } from "@mui/material";
import React, { useState, useEffect, useContext, useRef } from "react";
import Grid from "@mui/material/Grid";
import { Input } from "@mui/material";
import Head from "next/head";
import { Global, css } from "@emotion/react";
import { setCssMsg } from "./ThemeFirebase";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cssBackgroundState,
  cssTopbarState,
  cssTopbarDecoState,
  cssChatMsgState,
  cssChatMsgDecoState,
} from "../recoil/States";
import { SketchPicker, ColorResult } from "react-color";
// @ts-ignoree
import { toCSS, toJSON } from "cssjson";

import { ThemeUiTargetId } from "../types";

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

  // 全体のTopbarのDecoのCSS設定
  const cssTopbarDeco = useRecoilValue(cssTopbarDecoState);
  const setCssTopbarDecoState = useSetRecoilState(cssTopbarDecoState);
  const handleCssTopbarDeco = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssTopbarDecoState(event.target.value);
  };

  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);
  const setCssChatMsgState = useSetRecoilState(cssChatMsgState);
  const handleCssChatMsg = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssChatMsgState(event.target.value);
  };

  // 全体のChatのMessageのDecoのCSS設定
  const cssChatMsgDeco = useRecoilValue(cssChatMsgDecoState);
  const setCssChatMsgDecoState = useSetRecoilState(cssChatMsgDecoState);
  const handleCssChatMsgDeco = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssChatMsgDecoState(event.target.value);
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
      <Stack spacing={2} direction="row">
        {props.id === "cssBackground" && (
          <>
            <TextField
              multiline
              value={cssBackground}
              rows={4}
              onChange={handleCssBackground}
            />
          </>
        )}

        {props.id === "cssTopbar" && (
          <>
            <TextField
              multiline
              value={cssTopbar}
              rows={4}
              onChange={handleCssTopbar}
            />
          </>
        )}

        {props.id === "cssTopbarDeco" && (
          <>
            <TextField
              multiline
              value={cssTopbarDeco}
              rows={4}
              onChange={handleCssTopbarDeco}
            />
          </>
        )}

        {props.id === "cssChatMsg" && (
          <>
            <TextField
              multiline
              value={cssChatMsg}
              rows={4}
              onChange={handleCssChatMsg}
            />
          </>
        )}

        {props.id === "cssChatMsgDeco" && (
          <>
            <TextField
              multiline
              value={cssChatMsgDeco}
              rows={4}
              onChange={handleCssChatMsgDeco}
            />
          </>
        )}
        <Button
          onClick={() =>
            setCssMsg({
              cssBackground: cssBackground,
              cssTopbar: cssTopbar,
              cssTopbarDeco: cssTopbarDeco,
              cssChatMsg: cssChatMsg,
              cssChatMsgDeco: cssChatMsgDeco,
            })
          }
        >
          Set Msg
        </Button>
      </Stack>
    </>
  );
};
