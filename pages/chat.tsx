import type { NextPage } from "next";
import Head from "next/head";
import { Box, Stack, Button, TextField, FormControl } from "@mui/material";
import {
  signIn,
  signOutUser,
  ProfilePic,
  UserName,
  setChatMsg,
  useGetChatMsgs,
  useGetChatSubMsgs,
  UseSetImgMsg,
  ChatMsgNormalEle,
  ChatMsgRecipiLayout,
  SubChatMsgRecipiLayout,
} from "../components/ChatParts";
import Grid from "@mui/material/Grid";
import { Input } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { Global, css } from "@emotion/react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { cssBackgroundState, imgFireStorageUrlsState } from "../recoil/States";
import { ChatLayoutChips } from "../components/Chips";
import { chatRadioBtnIdState } from "../recoil/States";
import {
  SwipeableTemporaryDrawer,
  CustomDrawer,
} from "../components/GlobalParts";
import { useGetWindowSize } from "../utils/get-window-size";

export function ChatMsgs() {
  //msgIdに応じて表示を切り替える
  const chatRadioBtnId = useRecoilValue(chatRadioBtnIdState);
  const msgId = chatRadioBtnId;

  const chatMsgs = useGetChatMsgs();

  const normal = chatMsgs.map((msg, index) => (
    <ChatMsgNormalEle key={index.toString()} msg={msg} />
  ));
  const recipe = chatMsgs.map((msg, index) => (
    <ChatMsgRecipiLayout key={index.toString()} msg={msg}>
      <SubChatMsgEle docId={msg?.id.toString()} />
    </ChatMsgRecipiLayout>
  ));

  return (
    <>
      {msgId === "Normal" && normal}
      {msgId === "Recipe" && recipe}
    </>
  );
}

//TODO docIdではなくmsgを取り込むようにする
export const SubChatMsgEle: React.FC<{ docId: any; getLimit?: number }> = (
  props
) => {
  const { docId, getLimit } = props;
  const subChatMsgs = useGetChatSubMsgs(docId, getLimit);
  const msg = subChatMsgs.map((msg, index) => (
    <SubChatMsgRecipiLayout key={msg?.id + index.toString()} msg={msg} />
  ));

  return <>{msg}</>;
};

export const ChatContent: React.FC = () => {
  const [imgUrls, setImgUrls] = useRecoilState(imgFireStorageUrlsState);

  const [title, setTitle] = useState("");
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const [chatTxt, setChatTxt] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatTxt(event.target.value);
  };

  const InputImg = () => {
    return (
      <>
        {/* <Input type="file" onChange={useSetImgMsg} /> */}
        <UseSetImgMsg></UseSetImgMsg>
      </>
    );
  };

  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12} md={6} alignItems="center">
          <FormControl fullWidth>
            <TextField
              label="Title"
              value={title}
              rows={4}
              onChange={handleTitle}
            />
            <Stack spacing={2} direction="row">
              <TextField
                label="Comment"
                multiline
                value={chatTxt}
                rows={4}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
            {/* 
                ███████╗███████╗████████╗
                ██╔════╝██╔════╝╚══██╔══╝
                ███████╗█████╗     ██║   
                ╚════██║██╔══╝     ██║   
                ███████║███████╗   ██║   
                ╚══════╝╚══════╝   ╚═╝
                   */}

            <Button onClick={() => setChatMsg(chatTxt, title)}>Set Msg</Button>
          </FormControl>
          <InputImg></InputImg>
          <p>{imgUrls.imageUrl.toString()}</p>
          {/*
 ██████╗██╗  ██╗██╗██████╗ ███████╗
██╔════╝██║  ██║██║██╔══██╗██╔════╝
██║     ███████║██║██████╔╝███████╗
██║     ██╔══██║██║██╔═══╝ ╚════██║
╚██████╗██║  ██║██║██║     ███████║
 ╚═════╝╚═╝  ╚═╝╚═╝╚═╝     ╚══════╝
                                   
 */}

          <ChatLayoutChips></ChatLayoutChips>
          <ChatMsgs />
        </Grid>
        <Grid item xs={12} md={6}>
          Planned site
        </Grid>
      </Grid>
    </>
  );
};

const Page: NextPage = () => {
  const { height, width } = useGetWindowSize();
  const cssText = useRecoilValue(cssBackgroundState);

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
      {width <= 599 && (
        <SwipeableTemporaryDrawer>
          <ChatContent />
        </SwipeableTemporaryDrawer>
      )}

      {599 < width && (
        <CustomDrawer>
          <ChatContent />
        </CustomDrawer>
      )}
    </>
  );
};

export default Page;
