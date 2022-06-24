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
  CssMsgEle,
  useGetCssMsgs,
  SetCssTextToAtomBtn,
  setCssImgMsg,
  useGetImgMsgs,
} from "../components/ThemeFirebase";
import { BgSizeSlider, CssImg } from "../components/ThemeParts";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cssBackgroundState,
  cssTopbarState,
  cssTopbarDecoState,
  cssChatMsgState,
  cssChatMsgDecoState,
  cssSubChatMsgState,
  editCssTargetIdState,
  cssChatMsgTitleDecoState,
  chatRadioBtnIdState,
} from "../recoil/States";
import { SketchPicker, ColorResult } from "react-color";
// @ts-ignore
import { toCSS, toJSON } from "cssjson";
import {
  CustomDrawer,
  SwipeableTemporaryDrawer,
} from "../components/GlobalParts";
import { EditThemeCss } from "../components/ThemeParts";
import { ChatRadioBtnId, ThemeUiTargetId } from "../types";
import { ChatMsgNormalEle, ChatMsgRecipiLayout } from "../components/ChatParts";
import { dummyMsg, dummyCss, dummyJson } from "../dummy";
import { ChatLayoutChips, EditCssTargetIdChips } from "../components/Chips";
import { SubChatMsgEle } from "./chat";
import { useGetWindowSize } from "../utils/get-window-size";

export const UseThemeContent: React.FC = () => {
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

  // for colorPicker setting (background-color)
  const [colorPicked, setColorPicked] = useState(
    toJSON(dummyCss).attributes.background
  );

  // (css) Json to CSS
  const [cssEdited, setCssEdited] = useState(
    toCSS({
      attributes: { ...dummyJson },
    })
  );

  // when color picked
  const handleColorPicked = (color: ColorResult) => {
    // "ff0500" + "80"の形式になるように
    const hexCode = `${color.hex}${decimalToHex(color.rgb.a || 0)}`;
    // editCssTargetId に応じて切り替え
    let cssJson = editCssTargetIdToCssJson(editCssTargetId);
    // JSONのCSSに追加
    cssJson[`background-color`] = hexCode;
    // setCssJson(cssJson);
    // 追加したJSONをCSSに変換して(cssEdited) stateに追加
    setCssEdited(
      toCSS({
        attributes: { ...cssJson },
      })
    );
    // ColorPickerの設定を更新
    setColorPicked(hexCode);
    // 全体のCSS設定を更新
    updateOverAllCss(cssEdited);
  };

  // 🎨 COLOR PICKER
  // Alpha値を16進数に変換する処理
  const decimalToHex = (alpha: number) =>
    alpha === 0 ? "00" : Math.round(255 * alpha).toString(16);

  const imgMsgs = useGetImgMsgs("css-img-msgs").map((msg, index) => (
    <div key={index.toString()}>
      {msg && (
        <CssImg
          // msg?.id.toString() cannot delete
          key={index.toString()}
          msg={msg}
        ></CssImg>
      )}
    </div>
  ));

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

  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12} md={6} alignItems="center">
          {useGetCssMsgs("cssMsgs").map((msg, index) => (
            <>
              {msg && (
                <div key={index.toString() + "div"}>
                  <CssMsgEle
                    key={index.toString() + "msg"}
                    msg={msg}
                  ></CssMsgEle>
                  <SetCssTextToAtomBtn
                    key={index.toString() + "css"}
                    msg={msg}
                  />
                </div>
              )}
            </>
          ))}
        </Grid>

        <Grid item xs={12} md={6} style={{ minHeight: "100vh" }}>
          {/* 
          ███████╗██████╗ ██╗████████╗     ██████╗███████╗███████╗
          ██╔════╝██╔══██╗██║╚══██╔══╝    ██╔════╝██╔════╝██╔════╝
          █████╗  ██║  ██║██║   ██║       ██║     ███████╗███████╗
          ██╔══╝  ██║  ██║██║   ██║       ██║     ╚════██║╚════██║
          ███████╗██████╔╝██║   ██║       ╚██████╗███████║███████║
          ╚══════╝╚═════╝ ╚═╝   ╚═╝        ╚═════╝╚══════╝╚══════╝
                                                        

             */}
          <EditCssTargetIdChips></EditCssTargetIdChips>
          <EditThemeCss id={editCssTargetId}></EditThemeCss>

          {/* 
                ███████╗ █████╗ ███╗   ███╗██████╗ ██╗     ███████╗    ███╗   ███╗███████╗ ██████╗ 
                ██╔════╝██╔══██╗████╗ ████║██╔══██╗██║     ██╔════╝    ████╗ ████║██╔════╝██╔════╝ 
                ███████╗███████║██╔████╔██║██████╔╝██║     █████╗      ██╔████╔██║███████╗██║  ███╗
                ╚════██║██╔══██║██║╚██╔╝██║██╔═══╝ ██║     ██╔══╝      ██║╚██╔╝██║╚════██║██║   ██║
                ███████║██║  ██║██║ ╚═╝ ██║██║     ███████╗███████╗    ██║ ╚═╝ ██║███████║╚██████╔╝
                ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝    ╚═╝     ╚═╝╚══════╝ ╚═════╝ 
                                                                                    */}
          <ChatLayoutChips></ChatLayoutChips>
          {chatRadioBtnId === "Normal" && <ChatMsgNormalEle msg={dummyMsg} />}
          {chatRadioBtnId === "Recipe" && (
            <ChatMsgRecipiLayout msg={dummyMsg}>
              <SubChatMsgEle docId={dummyMsg?.id.toString()} />
            </ChatMsgRecipiLayout>
          )}
          {/* 
              ██╗███╗   ███╗ █████╗  ██████╗ ███████╗
              ██║████╗ ████║██╔══██╗██╔════╝ ██╔════╝
              ██║██╔████╔██║███████║██║  ███╗█████╗  
              ██║██║╚██╔╝██║██╔══██║██║   ██║██╔══╝  
              ██║██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗
              ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
                                        */}
          <h3>Image</h3>
          <Grid item>
            <Input
              type="file"
              // rename css-img-msgs
              onChange={(e) => setCssImgMsg(e, "css-img-msgs")}
            />

            {/* 
                ██████╗  ██████╗     ███████╗██╗███████╗███████╗
                ██╔══██╗██╔════╝     ██╔════╝██║╚══███╔╝██╔════╝
                ██████╔╝██║  ███╗    ███████╗██║  ███╔╝ █████╗  
                ██╔══██╗██║   ██║    ╚════██║██║ ███╔╝  ██╔══╝  
                ██████╔╝╚██████╔╝    ███████║██║███████╗███████╗
                ╚═════╝  ╚═════╝     ╚══════╝╚═╝╚══════╝╚══════╝
                                                 */}

            <BgSizeSlider></BgSizeSlider>

            {/* 
              ██╗███╗   ███╗ █████╗  ██████╗ ███████╗    ██████╗ ████████╗███╗   ██╗
              ██║████╗ ████║██╔══██╗██╔════╝ ██╔════╝    ██╔══██╗╚══██╔══╝████╗  ██║
              ██║██╔████╔██║███████║██║  ███╗█████╗      ██████╔╝   ██║   ██╔██╗ ██║
              ██║██║╚██╔╝██║██╔══██║██║   ██║██╔══╝      ██╔══██╗   ██║   ██║╚██╗██║
              ██║██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗    ██████╔╝   ██║   ██║ ╚████║
              ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚═════╝    ╚═╝   ╚═╝  ╚═══╝
                                                                       */}
            <h4>Image</h4>
            {imgMsgs}
            <h4>Color</h4>
            <SketchPicker color={colorPicked} onChange={handleColorPicked} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

const Page: NextPage = () => {
  const cssBackground = useRecoilValue(cssBackgroundState);
  const { height, width } = useGetWindowSize();
  return (
    <>
      <Global
        styles={css`
          body {
            ${cssBackground}
          }
        `}
      />
      <Head>
        <title>Hamu House</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {width <= 599 && (
        <SwipeableTemporaryDrawer>
          <UseThemeContent></UseThemeContent>
        </SwipeableTemporaryDrawer>
      )}

      {599 < width && (
        <CustomDrawer>
          <UseThemeContent></UseThemeContent>
        </CustomDrawer>
      )}
    </>
  );
};

export default Page;
