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
  CssImg,
  useGetCssMsgs,
  SetCssTextToAtomBtn,
  setCssImg,
  useImgMsgs,
} from "../components/ThemeFirebase";
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
} from "../recoil/States";
import { SketchPicker, ColorResult } from "react-color";
// @ts-ignoree
import { toCSS, toJSON } from "cssjson";
import Slider from "@mui/material/Slider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { CustomDrawer } from "../components/GlobalParts";
import { EditThemeCss } from "../components/ThemeParts";
import { ThemeUiTargetId } from "../types";
import { ChatMsgEle } from "../components/ChatFirebase";
import { dummyMsg, dummyCss, dummyJson } from "../dummy";
import { ChatLayoutChips, EditCssTargetIdChips } from "../components/Chips";

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

  // for colorPicker setting (background-color)
  // TODO background 以外に
  const [colorPicked, setColorPicked] = useState(
    toJSON(dummyCss).attributes.background
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
        <CssImg
          // msg?.id.toString() cannot delete
          key={msg?.id?.toString() + index.toString() + "msg"}
          msg={msg}
        ></CssImg>
      )}
    </div>
  ));

  /**
███████╗██╗     ██╗██████╗ ███████╗██████╗ 
██╔════╝██║     ██║██╔══██╗██╔════╝██╔══██╗
███████╗██║     ██║██║  ██║█████╗  ██████╔╝
╚════██║██║     ██║██║  ██║██╔══╝  ██╔══██╗
███████║███████╗██║██████╔╝███████╗██║  ██║
╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝
                                           
 */

  function backgroundSizeText(value: number | number[]) {
    return `${value}px`;
  }

  const [backgroundSize, setBackgroundSize] = React.useState<number[]>([50]);

  const handleSlider = (event: Event, newValue: number | number[]) => {
    // editCssTargetId に応じて切り替え
    // switchCssJsonAccordingAlignment();
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
            ${cssBackground}
          }
        `}
      />
      <Head>
        <title>Hamu House</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CustomDrawer>
        <Grid container direction="row">
          <Grid item xs={12} md={6} alignItems="center">
            {useGetCssMsgs("cssMsgs").map((msg, index) => (
              <>
                {msg && (
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
            <ChatMsgEle msg={dummyMsg} />

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
              <Input type="file" onChange={(e) => setCssImg(e, "cssImgMsgs")} />
              <h4>background-size</h4>
              <Slider
                getAriaLabel={() => "background-size range"}
                value={backgroundSize}
                onChange={handleSlider}
                valueLabelDisplay="auto"
                valueLabelFormat={backgroundSizeText}
              />
              {imgMsgs}
              <h4>Color</h4>
              <SketchPicker color={colorPicked} onChange={handleColorPicked} />
            </Grid>
          </Grid>
        </Grid>
      </CustomDrawer>
    </>
  );
};

export default Page;
