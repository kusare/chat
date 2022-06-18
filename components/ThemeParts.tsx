import { NextPage } from "next";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack, Button, Slider } from "@mui/material";
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
  cssSubChatMsgState,
  cssChatMsgTitleDecoState,
  editCssTargetIdState,
  chatRadioBtnIdState,
} from "../recoil/States";
import { SketchPicker, ColorResult } from "react-color";
// @ts-ignore
import { toCSS, toJSON } from "cssjson";
import { ThemeUiTargetId } from "../types";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  Unsubscribe,
} from "firebase/auth";
import dayjs from "dayjs";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  ChatMsgState,
  ChatMsg,
  CssMsgState,
  CssMsg,
  ImgMsg,
  ImgMsgState,
} from "../types";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import { dummyJson, dummyCss } from "../dummy";

export const EditThemeCss: React.FC<{ id: ThemeUiTargetId }> = (props) => {
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

  // 全体のChatのSubのMessageのCSS設定
  const cssSubChatMsg = useRecoilValue(cssSubChatMsgState);
  const setCssSubChatMsgState = useSetRecoilState(cssSubChatMsgState);
  const handleCssSubChatMsg = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssSubChatMsgState(event.target.value);
  };

  // 全体のChatのSubのMessageのCSS設定
  const cssChatMsgTitleDeco = useRecoilValue(cssChatMsgTitleDecoState);
  const setCssChatMsgTitleDecoState = useSetRecoilState(
    cssChatMsgTitleDecoState
  );
  const handleCssChatMsgTitleDeco = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCssChatMsgTitleDecoState(event.target.value);
  };

  /**
██████╗ ███████╗████████╗██╗   ██╗██████╗ ███╗   ██╗
██╔══██╗██╔════╝╚══██╔══╝██║   ██║██╔══██╗████╗  ██║
██████╔╝█████╗     ██║   ██║   ██║██████╔╝██╔██╗ ██║
██╔══██╗██╔══╝     ██║   ██║   ██║██╔══██╗██║╚██╗██║
██║  ██║███████╗   ██║   ╚██████╔╝██║  ██║██║ ╚████║
╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
                                                    
 */
  //TODO mapに書き換え
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
        {props.id === "cssSubChatMsg" && (
          <>
            <TextField
              multiline
              value={cssSubChatMsg}
              rows={4}
              onChange={handleCssSubChatMsg}
            />
          </>
        )}
        {props.id === "cssChatMsgTitleDeco" && (
          <>
            <TextField
              multiline
              value={cssChatMsgTitleDeco}
              rows={4}
              onChange={handleCssChatMsgTitleDeco}
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

/**
 * message
 */
export const CssImg: React.FC<{ msg: ImgMsg }> = (props) => {
  /**
██████╗ ███████╗ ██████╗ ██████╗ ██╗██╗     
██╔══██╗██╔════╝██╔════╝██╔═══██╗██║██║     
██████╔╝█████╗  ██║     ██║   ██║██║██║     
██╔══██╗██╔══╝  ██║     ██║   ██║██║██║     
██║  ██║███████╗╚██████╗╚██████╔╝██║███████╗
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝
                                            
 */

  // 全体の背景のCSS設定はcssBackgroundStateから
  const cssBackground = useRecoilValue(cssBackgroundState);
  const setCssBackgroundState = useSetRecoilState(cssBackgroundState);

  // 全体のtopbarのCSS設定
  const cssTopbar = useRecoilValue(cssTopbarState);
  const setCssTopbarState = useSetRecoilState(cssTopbarState);

  // 全体のtopbarのCSS設定
  const cssTopbarDeco = useRecoilValue(cssTopbarDecoState);
  const setCssTopbarDecoState = useSetRecoilState(cssTopbarDecoState);

  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);
  const setCssChatMsgState = useSetRecoilState(cssChatMsgState);

  // 全体のChatのMessageのDecoのCSS設定
  const cssChatMsgDeco = useRecoilValue(cssChatMsgDecoState);
  const setCssChatMsgDecoState = useSetRecoilState(cssChatMsgDecoState);

  // 全体のSubのChatのCSS設定
  const cssSubChatMsg = useRecoilValue(cssSubChatMsgState);
  const setSubCssChatMsgState = useSetRecoilState(cssSubChatMsgState);

  // 全体のSubのChatのCSS設定
  const cssChatMsgTitleDeco = useRecoilValue(cssChatMsgTitleDecoState);
  const setCssChatMsgTitleDecoState = useSetRecoilState(
    cssChatMsgTitleDecoState
  );

  // 編集するCSSを選択するときに使用するID
  const editCssTargetId = useRecoilValue(editCssTargetIdState);
  const setEditCssTargetId = useSetRecoilState(editCssTargetIdState);

  /**
███████╗████████╗ █████╗ ████████╗███████╗
██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
███████╗   ██║   ███████║   ██║   █████╗  
╚════██║   ██║   ██╔══██║   ██║   ██╔══╝  
███████║   ██║   ██║  ██║   ██║   ███████╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
                                          
 */

  // (css) Json to CSS
  const [cssEdited, setCssEdited] = useState(
    toCSS({
      attributes: { ...dummyJson },
    })
  );

  const editCssTargetIdToCssJson = (targetId: ThemeUiTargetId) => {
    const id = targetId;
    let recoilState = null;
    id === "cssBackground" && (recoilState = cssBackground);
    id === "cssTopbar" && (recoilState = cssTopbar);
    id === "cssTopbarDeco" && (recoilState = cssTopbarDeco);
    id === "cssChatMsg" && (recoilState = cssChatMsg);
    id === "cssChatMsgDeco" && (recoilState = cssChatMsgDeco);
    id === "cssSubChatMsg" && (recoilState = cssSubChatMsg);
    id === "cssChatMsgTitleDeco" && (recoilState = cssChatMsgTitleDeco);

    const cssJson = toJSON(recoilState).attributes;

    return cssJson;
  };

  // Update overall CSS settings
  // 全体のCSS設定を更新
  const updateOverAllCss = (css: string) => {
    const id = editCssTargetId;
    id === "cssBackground" && setCssBackgroundState(css);
    id === "cssTopbar" && setCssTopbarState(css);
    id === "cssTopbarDeco" && setCssTopbarDecoState(css);
    id === "cssChatMsg" && setCssChatMsgState(css);
    id === "cssChatMsgDeco" && setCssChatMsgDecoState(css);
    id === "cssChatMsgTitleDeco" && setCssChatMsgTitleDecoState(css);
  };

  // 背景画像を設定するテスト関数予定地
  const chgBg = () => {
    // editCssTargetId に応じて切り替え
    let cssJson = editCssTargetIdToCssJson(editCssTargetId);
    // setJsonCss(toJSON(cssBackground).attributes);
    // JSONのCSSに追加
    cssJson[`background-image`] = `url('${props?.msg?.imageUrl}')`;
    // 追加したJSONをCSSに変換して(cssEdited) stateに追加
    const cssEdited = toCSS({
      attributes: { ...cssJson },
    });
    // 追加したJSONをCSSに変換して(cssEdited) stateに追加
    setCssEdited(
      toCSS({
        attributes: { ...cssJson },
      })
    );
    // 全体のCSS設定を更新
    // TODO theme.tsxと統合
    editCssTargetId === "cssBackground" && setCssBackgroundState(cssEdited);
    editCssTargetId === "cssTopbar" && setCssTopbarState(cssEdited);
    editCssTargetId === "cssTopbarDeco" && setCssTopbarDecoState(cssEdited);
    editCssTargetId === "cssChatMsg" && setCssChatMsgState(cssEdited);
    editCssTargetId === "cssChatMsgDeco" && setCssChatMsgDecoState(cssEdited);
    editCssTargetId === "cssChatMsgTitleDeco" &&
      setCssChatMsgTitleDecoState(cssEdited);
    // 全体のCSS設定を更新
    updateOverAllCss(cssEdited);
  };

  /**
██████╗ ███████╗████████╗██╗   ██╗██████╗ ███╗   ██╗
██╔══██╗██╔════╝╚══██╔══╝██║   ██║██╔══██╗████╗  ██║
██████╔╝█████╗     ██║   ██║   ██║██████╔╝██╔██╗ ██║
██╔══██╗██╔══╝     ██║   ██║   ██║██╔══██╗██║╚██╗██║
██║  ██║███████╗   ██║   ╚██████╔╝██║  ██║██║ ╚████║
╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
                                                    
 */

  if (!props.msg) return <></>;

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        {/* 🖼アップした画像 */}
        {props.msg.imageUrl && (
          <CardMedia
            component="img"
            height="50"
            sx={{ width: 50 }}
            image={props.msg.imageUrl}
            alt="Paella dish"
          />
        )}
        {/* SET to whole css style` */}
        <button onClick={chgBg}>SET</button>
      </Card>
    </>
  );
};

/**
 * background-image size change
 */
export const BgSizeSlider: React.FC = () => {
  /**
██████╗ ███████╗ ██████╗ ██████╗ ██╗██╗     
██╔══██╗██╔════╝██╔════╝██╔═══██╗██║██║     
██████╔╝█████╗  ██║     ██║   ██║██║██║     
██╔══██╗██╔══╝  ██║     ██║   ██║██║██║     
██║  ██║███████╗╚██████╗╚██████╔╝██║███████╗
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝
                                            
 */

  // 全体の背景のCSS設定はcssBackgroundStateから
  const cssBackground = useRecoilValue(cssBackgroundState);
  const setCssBackgroundState = useSetRecoilState(cssBackgroundState);

  // 全体のtopbarのCSS設定
  const cssTopbar = useRecoilValue(cssTopbarState);
  const setCssTopbarState = useSetRecoilState(cssTopbarState);

  // 全体のtopbarのCSS設定
  const cssTopbarDeco = useRecoilValue(cssTopbarDecoState);
  const setCssTopbarDecoState = useSetRecoilState(cssTopbarDecoState);

  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);
  const setCssChatMsgState = useSetRecoilState(cssChatMsgState);

  // 全体のChatのMessageのDecoのCSS設定
  const cssChatMsgDeco = useRecoilValue(cssChatMsgDecoState);
  const setCssChatMsgDecoState = useSetRecoilState(cssChatMsgDecoState);

  // 全体のSubのChatのCSS設定
  const cssSubChatMsg = useRecoilValue(cssSubChatMsgState);
  const setSubCssChatMsgState = useSetRecoilState(cssSubChatMsgState);

  // 全体のSubのChatのCSS設定
  const cssChatMsgTitleDeco = useRecoilValue(cssChatMsgTitleDecoState);
  const setCssChatMsgTitleDecoState = useSetRecoilState(
    cssChatMsgTitleDecoState
  );

  // 編集するCSSを選択するときに使用するID
  const editCssTargetId = useRecoilValue(editCssTargetIdState);
  const setEditCssTargetId = useSetRecoilState(editCssTargetIdState);

  //msgIdに応じてサンプルのメッセージ表示を切り替える
  const chatRadioBtnId = useRecoilValue(chatRadioBtnIdState);
  /**
███████╗████████╗ █████╗ ████████╗███████╗
██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
███████╗   ██║   ███████║   ██║   █████╗  
╚════██║   ██║   ██╔══██║   ██║   ██╔══╝  
███████║   ██║   ██║  ██║   ██║   ███████╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
                                          
 */

  // (css) Json to CSS
  const [cssEdited, setCssEdited] = useState(
    toCSS({
      attributes: { ...dummyJson },
    })
  );

  // for colorPicker setting (background-color)
  // TODO background 以外に
  // const [colorPicked, setColorPicked] = useState(
  //   toJSON(dummyCss).attributes.background
  // );

  const editCssTargetIdToCssJson = (targetId: ThemeUiTargetId) => {
    const id = targetId;
    let recoilState = null;
    id === "cssBackground" && (recoilState = cssBackground);
    id === "cssTopbar" && (recoilState = cssTopbar);
    id === "cssTopbarDeco" && (recoilState = cssTopbarDeco);
    id === "cssChatMsg" && (recoilState = cssChatMsg);
    id === "cssChatMsgDeco" && (recoilState = cssChatMsgDeco);
    id === "cssSubChatMsg" && (recoilState = cssSubChatMsg);
    id === "cssChatMsgTitleDeco" && (recoilState = cssChatMsgTitleDeco);

    const cssJson = toJSON(recoilState).attributes;

    return cssJson;
  };

  // Update overall CSS settings
  // 全体のCSS設定を更新
  const updateOverAllCss = (css: string) => {
    const id = editCssTargetId;
    id === "cssBackground" && setCssBackgroundState(css);
    id === "cssTopbar" && setCssTopbarState(css);
    id === "cssTopbarDeco" && setCssTopbarDecoState(css);
    id === "cssChatMsg" && setCssChatMsgState(css);
    id === "cssChatMsgDeco" && setCssChatMsgDecoState(css);
    id === "cssChatMsgTitleDeco" && setCssChatMsgTitleDecoState(css);
  };

  function backgroundSizeText(value: number | number[]) {
    return `${value}px`;
  }

  const [backgroundSize, setBackgroundSize] = React.useState<number[]>([50]);

  const handleSlider = (event: Event, newValue: number | number[]) => {
    // editCssTargetId に応じて切り替え
    let cssJson = editCssTargetIdToCssJson(editCssTargetId);
    // JSONのCSSに追加
    cssJson[`background-size`] = backgroundSizeText(backgroundSize);
    // setCssJson(cssJson);
    // 追加したJSONをCSSに変換して(cssEdited) stateに追加
    setCssEdited(
      toCSS({
        attributes: { ...cssJson },
      })
    );
    // slide
    setBackgroundSize(newValue as number[]);
    // 全体のCSS設定を更新
    updateOverAllCss(cssEdited);
  };
  return (
    <>
      <h4>background-size</h4>
      <Slider
        getAriaLabel={() => "background-size range"}
        value={backgroundSize}
        onChange={handleSlider}
        valueLabelDisplay="auto"
        valueLabelFormat={backgroundSizeText}
      />
    </>
  );
};

// const useEditCssTargetIdToCssJson = (targetId: ThemeUiTargetId) => {
//   // 全体の背景のCSS設定はcssBackgroundStateから
//   const cssBackground = useRecoilValue(cssBackgroundState);
//   const setCssBackgroundState = useSetRecoilState(cssBackgroundState);

//   // 全体のtopbarのCSS設定
//   const cssTopbar = useRecoilValue(cssTopbarState);
//   const setCssTopbarState = useSetRecoilState(cssTopbarState);

//   // 全体のtopbarのCSS設定
//   const cssTopbarDeco = useRecoilValue(cssTopbarDecoState);
//   const setCssTopbarDecoState = useSetRecoilState(cssTopbarDecoState);

//   // 全体のChatのMessageのCSS設定
//   const cssChatMsg = useRecoilValue(cssChatMsgState);
//   const setCssChatMsgState = useSetRecoilState(cssChatMsgState);

//   // 全体のChatのMessageのDecoのCSS設定
//   const cssChatMsgDeco = useRecoilValue(cssChatMsgDecoState);
//   const setCssChatMsgDecoState = useSetRecoilState(cssChatMsgDecoState);

//   // 全体のSubのChatのCSS設定
//   const cssSubChatMsg = useRecoilValue(cssSubChatMsgState);
//   const setSubCssChatMsgState = useSetRecoilState(cssSubChatMsgState);

//   // 全体のSubのChatのCSS設定
//   const cssChatMsgTitleDeco = useRecoilValue(cssChatMsgTitleDecoState);
//   const setCssChatMsgTitleDecoState = useSetRecoilState(
//     cssChatMsgTitleDecoState
//   );

//   // 編集するCSSを選択するときに使用するID
//   const editCssTargetId = useRecoilValue(editCssTargetIdState);
//   const setEditCssTargetId = useSetRecoilState(editCssTargetIdState);
//   const id = targetId;
//   let recoilState = null;
//   id === "cssBackground" && (recoilState = cssBackground);
//   id === "cssTopbar" && (recoilState = cssTopbar);
//   id === "cssTopbarDeco" && (recoilState = cssTopbarDeco);
//   id === "cssChatMsg" && (recoilState = cssChatMsg);
//   id === "cssChatMsgDeco" && (recoilState = cssChatMsgDeco);
//   id === "cssSubChatMsg" && (recoilState = cssSubChatMsg);
//   id === "cssChatMsgTitleDeco" && (recoilState = cssChatMsgTitleDeco);

//   const cssJson = toJSON(recoilState).attributes;

//   return cssJson;
// };
