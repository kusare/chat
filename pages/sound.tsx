import type { NextPage } from "next";
import Head from "next/head";
import { Box, Stack, Button, TextField } from "@mui/material";
import {
  signIn,
  signOutUser,
  ProfilePic,
  UserName,
  setChatMsg,
  ChatMsgEle,
  useGetMsgs,
  useGetChatSubMsgs,
  setImgMsg,
  ChatMsgRecipiLayout,
  SubChatMsgRecipiLayout,
} from "../components/ChatFirebase";
import Grid from "@mui/material/Grid";
import { Input } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { Global, css } from "@emotion/react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { cssBackgroundState } from "../recoil/States";
import { CustomDrawer } from "../components/GlobalParts";
import { chatRadioBtnIdState } from "../recoil/States";
import { SoundTest } from "../components/SoundParts";

const Page: NextPage = () => {
  const cssText = useRecoilValue(cssBackgroundState);
  return (
    <div>
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
      <CustomDrawer>
        <p>sound</p>
        <SoundTest></SoundTest>
      </CustomDrawer>
    </div>
  );
};

export default Page;
