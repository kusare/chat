import { getApps, getApp, initializeApp, FirebaseApp } from "firebase/app";
import { firebaseAppConfig } from "./firebase-config";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  Unsubscribe,
} from "firebase/auth";
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
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { timeStamp } from "console";
import {
  Box,
  Stack,
  Button,
  TextField,
  Avatar,
  FormControl,
} from "@mui/material";
import { css } from "@emotion/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import {
  msgsState,
  subChatMsgsState,
  cssBackgroundState,
  cssTopbarState,
  cssChatMsgState,
  cssSubChatMsgState,
  cssChatMsgDecoState,
  cssChatMsgTitleDecoState,
} from "../recoil/States";
import { ChatMsg, ChatMsgState } from "../types";
import { dummyMsg } from "../dummy";
import Link from "next/link";
import {
  chatMsgForAdd,
  setSubChatMsg,
  CHAT_MSG_COL_NAME,
  SUB_CHAT_MSG_COL_NAME,
} from "./ChatParts";

export const ThreadTopMsgById: React.FC<{
  docId: any;
  children: React.ReactNode;
}> = (props) => {
  const { docId, children } = props;
  const topMsg = useGetThreadTopMsgById(docId);

  return (
    <>
      <ThreadTopMsg msg={topMsg}>{children}</ThreadTopMsg>
    </>
  );
};

export const useGetThreadTopMsgById = (docId: string) => {
  //TODO ほかにいい方法がないか
  const id = docId || "dummyId";

  const [Msg, setMsg] = useState([dummyMsg]);

  useEffect(() => {
    const db = getFirestore();
    const docRef = doc(collection(db, CHAT_MSG_COL_NAME), id);
    const colRef = collection(docRef, SUB_CHAT_MSG_COL_NAME);
    const recentMessagesQuery = query(colRef, orderBy("date", "desc"));
    // Start listening to the query.
    const unsub: Unsubscribe = onSnapshot(recentMessagesQuery, (snapshot) => {
      let addedMsgs: ChatMsg[] = [];
      snapshot.docs.map((change) => {
        addedMsgs.push(chatMsgForAdd(change));
      }, []);
      setMsg(addedMsgs);
      return unsub;
    });
  }, [docId, id]);

  return Msg[0];
};

export const ThreadTopMsg: React.FC<{
  msg: ChatMsgState;
  children: React.ReactNode;
}> = (props) => {
  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);
  // 全体のChatのMessageのDecoのCSS設定
  const cssChatMsgDeco = useRecoilValue(cssChatMsgDecoState);
  // 全体のChatのSubのMessageのCSS設定
  const cssChatMsgTitleDeco = useRecoilValue(cssChatMsgTitleDecoState);

  const [chatTxt, setChatTxt] = useState("");
  const handleMsgInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatTxt(event.target.value);
  };

  if (!props.msg) return <></>;

  return (
    <>
      <div
        css={css`
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 30px;
          position: relative;
        `}
      >
        <div
          css={css`
            ${cssChatMsgDeco}
          `}
        >{`planned cssChatMsgDeco`}</div>
        <div
          css={css`
            ${cssChatMsg}
          `}
        >
          <Link href={`/thread/?id=${props.msg.id}`}>
            <h2
              css={css`
                text-align: center;
              `}
            >
              {props.msg.title}
            </h2>
          </Link>
          {/*               
		    ████████╗██╗████████╗██╗     ███████╗    ██████╗ ███████╗ ██████╗ ██████╗ 
		    ╚══██╔══╝██║╚══██╔══╝██║     ██╔════╝    ██╔══██╗██╔════╝██╔════╝██╔═══██╗
		       ██║   ██║   ██║   ██║     █████╗      ██║  ██║█████╗  ██║     ██║   ██║
		       ██║   ██║   ██║   ██║     ██╔══╝      ██║  ██║██╔══╝  ██║     ██║   ██║
		       ██║   ██║   ██║   ███████╗███████╗    ██████╔╝███████╗╚██████╗╚██████╔╝
		       ╚═╝   ╚═╝   ╚═╝   ╚══════╝╚══════╝    ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ 
										 */}
          <p
            css={css`
              ${cssChatMsgTitleDeco}
            `}
          >
            title deco
          </p>
          <Stack
            spacing={2}
            direction="row"
            css={css`
              margin-top: 50px;
            `}
          >
            <Box>
              {props.msg.profilePicUrl && (
                <Avatar
                  alt="profilePic"
                  src={props.msg.profilePicUrl}
                  sx={{ width: 48, height: 48 }}
                />
              )}
            </Box>

            <Box>
              <Stack spacing={2} direction="row">
                {props.msg.name && <div>{props.msg.name}</div>}
                {props.msg.date && <time>{props.msg.date.toString()}</time>}
              </Stack>

              {/*
		     ██████╗██╗  ██╗ █████╗ ████████╗    ████████╗██╗  ██╗████████╗
		    ██╔════╝██║  ██║██╔══██╗╚══██╔══╝    ╚══██╔══╝╚██╗██╔╝╚══██╔══╝
		    ██║     ███████║███████║   ██║          ██║    ╚███╔╝    ██║   
		    ██║     ██╔══██║██╔══██║   ██║          ██║    ██╔██╗    ██║   
		    ╚██████╗██║  ██║██║  ██║   ██║          ██║   ██╔╝ ██╗   ██║   
		     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝          ╚═╝   ╚═╝  ╚═╝   ╚═╝   
								      */}
            </Box>
          </Stack>
          <TextField
            multiline
            fullWidth
            variant="standard"
            value={props.msg.chatTxt}
          />
        </div>
        <div>
          {props.msg.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={props.msg.imageUrl}
              alt="no image"
              css={css(`
		max-width: 100%;
	      `)}
            />
          )}
        </div>
        {/* 
      ███████╗██╗   ██╗██████╗     ███╗   ███╗███████╗ ██████╗ 
      ██╔════╝██║   ██║██╔══██╗    ████╗ ████║██╔════╝██╔════╝ 
      ███████╗██║   ██║██████╔╝    ██╔████╔██║███████╗██║  ███╗
      ╚════██║██║   ██║██╔══██╗    ██║╚██╔╝██║╚════██║██║   ██║
      ███████║╚██████╔╝██████╔╝    ██║ ╚═╝ ██║███████║╚██████╔╝
      ╚══════╝ ╚═════╝ ╚═════╝     ╚═╝     ╚═╝╚══════╝ ╚═════╝  
      */}
        <div
          css={css`
            ${cssChatMsg}
          `}
        >
          {props.children}
          {/* 
		███████╗███████╗████████╗
		██╔════╝██╔════╝╚══██╔══╝
		███████╗█████╗     ██║   
		╚════██║██╔══╝     ██║   
		███████║███████╗   ██║   
		╚══════╝╚══════╝   ╚═╝   
					  */}

          <TextField
            fullWidth
            multiline
            placeholder="No Comment"
            maxRows={4}
            value={chatTxt}
            onChange={handleMsgInput}
          />
          <IconButton
            aria-label="edit"
            onClick={() =>
              props?.msg?.id && setSubChatMsg(chatTxt, props.msg.id)
            }
          >
            <EditIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
};
