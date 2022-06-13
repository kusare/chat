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
import { CustomDrawer } from "../components/GlobalUi";
import { ChatRadioBtn } from "../components/RadioBtn";
import { chatRadioBtnIdState } from "../recoil/States";

export const SubChatMsgEle: React.FC<{ docId: any }> = (props) => {
  const { docId } = props;
  const subChatMsgs = useGetChatSubMsgs(docId);
  const msg = subChatMsgs.map((msg, index) => (
    <SubChatMsgRecipiLayout key={msg?.id + index.toString()} msg={msg} />
  ));

  return <>{msg}</>;
};

export function ChatMsgs() {
  const chatRadioBtnId = useRecoilValue(chatRadioBtnIdState);
  const msgId = chatRadioBtnId;

  const chatMsgs = useGetMsgs();

  const normal = chatMsgs.map((msg, index) => (
    <ChatMsgEle key={msg?.id + index.toString()} msg={msg} />
  ));
  const recipe = chatMsgs.map((msg, index) => (
    <ChatMsgRecipiLayout key={msg?.id + index.toString()} msg={msg}>
      <SubChatMsgEle docId={msg?.id.toString()} />
      {msg?.id}
    </ChatMsgRecipiLayout>
  ));

  return (
    <>
      {msgId === "Normal" && normal}
      {msgId === "Recipe" && recipe}
    </>
  );
}

const Home: NextPage = () => {
  const chatRadioBtnId = useRecoilValue(chatRadioBtnIdState);
  const id = chatRadioBtnId;

  const [text, setText] = useState("コメント");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

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
        <Grid container direction="row">
          <Grid item xs={12} md={6} alignItems="center">
            <Box>
              <Stack spacing={2} direction="row">
                <TextField
                  label="Comment"
                  multiline
                  placeholder="Placeholder"
                  value={text}
                  rows={4}
                  onChange={handleChange}
                />
                <Button onClick={() => setChatMsg(text)}>Set Msg</Button>
              </Stack>
            </Box>
            <Input type="file" onChange={setImgMsg} />
            {/*
            ██████╗  █████╗ ██████╗ ██╗ ██████╗ 
            ██╔══██╗██╔══██╗██╔══██╗██║██╔═══██╗
            ██████╔╝███████║██║  ██║██║██║   ██║
            ██╔══██╗██╔══██║██║  ██║██║██║   ██║
            ██║  ██║██║  ██║██████╔╝██║╚██████╔╝
            ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝ ╚═════╝ 
 */}

            <ChatRadioBtn></ChatRadioBtn>
            <ChatMsgs />
          </Grid>
          <Grid item xs={12} md={6}>
            Planned site
          </Grid>
        </Grid>
      </CustomDrawer>
    </div>
  );
};

export default Home;
