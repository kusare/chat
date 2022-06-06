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
  useGetCssMsgs,
  SetCssTextToAtomBtn,
  setCssImg,
  useImgMsgs,
} from "../components/ThemeFirebase";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cssBackgroundState,
  cssTopbarState,
  cssChatMsgState,
} from "../recoil/cssMsgStates";
import { SketchPicker, ColorResult } from "react-color";
// @ts-ignoree
import { toCSS, toJSON } from "cssjson";
import Slider from "@mui/material/Slider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { CustomDrawer } from "../components/GlobalUi";
import { EditThemeCss } from "../components/ThemeParts";
import { ThemeUiTargetId } from "../types";
import {
  signIn,
  signOutUser,
  ProfilePic,
  UserName,
  setMsg,
  ChatMsgEle,
  useGetMsgs,
  setImgMsg,
} from "../components/ChatFirebase";
import { DummyMsg } from "../dummy";

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

  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);
  const setCssChatMsgState = useSetRecoilState(cssChatMsgState);

  /**
███████╗████████╗ █████╗ ████████╗███████╗
██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
███████╗   ██║   ███████║   ██║   █████╗  
╚════██║   ██║   ██╔══██║   ██║   ██╔══╝  
███████║   ██║   ██║  ██║   ██║   ███████╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
                                          
 */

  // (props) CSS to Json
  // TODO ダミーのCSSが欲しい
  const [cssJson, setCssJson] = useState(toJSON(cssBackground).attributes);

  // (css) Json to CSS
  const [cssEdited, setCssEdited] = useState(
    toCSS({
      attributes: { ...cssJson },
    })
  );

  // for colorPicker setting (background-color)
  const [colorPicked, setColorPicked] = useState(cssJson.background);

  /**
████████╗ ██████╗  ██████╗  ██████╗ ██╗     ███████╗
╚══██╔══╝██╔═══██╗██╔════╝ ██╔════╝ ██║     ██╔════╝
   ██║   ██║   ██║██║  ███╗██║  ███╗██║     █████╗  
   ██║   ██║   ██║██║   ██║██║   ██║██║     ██╔══╝  
   ██║   ╚██████╔╝╚██████╔╝╚██████╔╝███████╗███████╗
   ╚═╝    ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝
                                                    
 */

  const [alignment, setAlignment] =
    React.useState<ThemeUiTargetId>("cssBackground");

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: ThemeUiTargetId
  ) => {
    setAlignment(newAlignment);
  };

  // Switch according to alignment
  // alignment に応じて切り替え
  const switchCssJsonAccordingAlignment = () => {
    alignment === "cssBackground" &&
      setCssJson(toJSON(cssBackground).attributes);
    alignment === "cssTopbar" && setCssJson(toJSON(cssTopbar).attributes);
    alignment === "cssChatMsg" && setCssJson(toJSON(cssChatMsg).attributes);
  };

  // Update overall CSS settings
  // 全体のCSS設定を更新
  const updateOverAllCss = (id: string) => {
    id === "cssBackground" && setCssBackgroundState(cssEdited);
    id === "cssTopbar" && setCssTopbarState(cssEdited);
    id === "cssChatMsg" && setCssChatMsgState(cssEdited);
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

  // for colorPicker setting (background-color)
  // const [colorPicked, setColorPicked] = useState(cssJson.background);

  // when color picked
  const handleColorPicked = (color: ColorResult) => {
    // "ff0500" + "80"の形式になるように
    const hexCode = `${color.hex}${decimalToHex(color.rgb.a || 0)}`;
    // alignment に応じて切り替え
    switchCssJsonAccordingAlignment();
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
    updateOverAllCss(alignment);
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
          id={alignment}
        ></GetCssImg>
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
    return `${value}%`;
  }

  const [backgroundSize, setBackgroundSize] = React.useState<number[]>([50]);

  const handleSlider = (event: Event, newValue: number | number[]) => {
    // alignment に応じて切り替え
    switchCssJsonAccordingAlignment();
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
    updateOverAllCss(alignment);
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
          <ToggleButton value="cssBackground">Background</ToggleButton>
          <ToggleButton value="cssTopbar">TopBar</ToggleButton>
          <ToggleButton value="cssChatMsg">Message</ToggleButton>
        </ToggleButtonGroup>
        <Grid container direction="row">
          <Grid item xs={12} md={6} style={{ minHeight: "100vh" }}>
            {/* 
                 ██████╗███████╗███████╗
                ██╔════╝██╔════╝██╔════╝
                ██║     ███████╗███████╗
                ██║     ╚════██║╚════██║
                ╚██████╗███████║███████║
                 ╚═════╝╚══════╝╚══════╝

             */}
            <ChatMsgEle msg={DummyMsg} />
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
        </Grid>
      </CustomDrawer>
    </>
  );
};

export default Page;
