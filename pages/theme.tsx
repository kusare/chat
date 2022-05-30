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
      <Header title="Hamu House"></Header>
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
            <Input type="file" onChange={(e) => setCssImg(e, "cssImgMsgs")} />
            {useCssMsgs("cssImgMsgs").map((msg, index) => (
              <div key={index.toString() + "div"}>
                <GetCssImg
                  // TODO msg?.id.toString() cannot delete
                  key={msg?.id.toString() + index.toString() + "msg"}
                  msg={msg}
                ></GetCssImg>
              </div>
            ))}
            <h4>background-color</h4>
            <SketchPicker color={colorPicked} onChange={handleColorPicked} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} alignItems="center">
          {useCssMsgs("cssMsgs").map((msg, index) => (
            <div key={index.toString() + "div"}>
              <GetCssMsg
                // TODO msg?.id.toString() cannot delete
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
    </>
  );
};

export default Page;
