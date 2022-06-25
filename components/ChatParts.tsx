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
import { firebaseApp, db } from "./firebase-config";

// TODO move to recoil/States
export const profilePicUrlState = atom<string>({
  key: "profilePicUrState", // unique ID (with respect to other atoms/selectors)
  default: "/images/profile_placeholder.png", // default value (aka initial value)
});

export const userNameState = atom<string>({
  key: "userNameState", // unique ID (with respect to other atoms/selectors)
  default: "NO NAME", // default value (aka initial value)
});

/**
██╗███╗   ██╗██╗████████╗██╗ █████╗ ██╗     ██╗███████╗███████╗
██║████╗  ██║██║╚══██╔══╝██║██╔══██╗██║     ██║╚══███╔╝██╔════╝
██║██╔██╗ ██║██║   ██║   ██║███████║██║     ██║  ███╔╝ █████╗  
██║██║╚██╗██║██║   ██║   ██║██╔══██║██║     ██║ ███╔╝  ██╔══╝  
██║██║ ╚████║██║   ██║   ██║██║  ██║███████╗██║███████╗███████╗
 */

/**
 * dayjs.extend(relativeTime);
 */
dayjs.extend(relativeTime);

/**
 * Signs-in
 */
export async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

/**
 * Signs-out
 */
export function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}

/**
 ██████╗ ███████╗████████╗
██╔════╝ ██╔════╝╚══██╔══╝
██║  ███╗█████╗     ██║   
██║   ██║██╔══╝     ██║   
╚██████╔╝███████╗   ██║   
 ╚═════╝ ╚══════╝   ╚═╝   
 */

/**
 * Returns the signed-in user's profile Pic URL.
 */
const getProfilePicUrl = (): string => {
  const user = getAuth().currentUser;
  if (user === null || user.photoURL === null)
    return "/images/profile_placeholder.png";
  return user.photoURL;
};

/**
 *  Returns the signed-in user's display name.
 */
export const getUserName = (): string => {
  const user = getAuth().currentUser;
  if (user === null || user.displayName === null) return "";
  return user.displayName;
};

/**
 * Loads chat messages history and listens for upcoming ones.
 */
export const chatMsgForAdd = (change: any) => {
  const msg = change.data();
  return {
    id: change.id,
    date: msg.date,
    name: msg.name,
    chatTxt: msg.chatTxt,
    title: msg.title,
    profilePicUrl: msg.profilePicUrl,
    imageUrl: msg.imageUrl,
  };
};

export const useGetChatMsgs = () => {
  const setChatMsgs = useSetRecoilState(msgsState);
  const chatMsgs = useRecoilValue(msgsState);
  const LIMIT = 12;

  useEffect(() => {
    const recentMessagesQuery = query(
      collection(getFirestore(), CHAT_MSG_COL_NAME),
      orderBy("date", "desc"),
      limit(LIMIT)
    );
    // Start listening to the query.
    const unsub: Unsubscribe = onSnapshot(recentMessagesQuery, (snapshot) => {
      let addedMsgs: ChatMsg[] = [];
      snapshot.docs.map((change) => {
        addedMsgs.push(chatMsgForAdd(change));
      }, []);
      setChatMsgs(addedMsgs);
      return unsub;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return chatMsgs;
};

export const useGetChatSubMsgs = (docId: string, getLimit: number = 3) => {
  //TODO ほかにいい方法がないかな
  const id = docId || "dummyId";

  const [subChatMsgs, setSubChatMsgs] = useState([dummyMsg]);
  const LIMIT = getLimit;

  useEffect(() => {
    const db = getFirestore();
    const docRef = doc(collection(db, CHAT_MSG_COL_NAME), id);
    const colRef = collection(docRef, SUB_CHAT_MSG_COL_NAME);
    const recentMessagesQuery = query(
      colRef,
      orderBy("date", "desc"),
      limit(LIMIT)
    );
    // Start listening to the query.
    const unsub: Unsubscribe = onSnapshot(recentMessagesQuery, (snapshot) => {
      let addedMsgs: ChatMsg[] = [];
      snapshot.docs.map((change) => {
        addedMsgs.push(chatMsgForAdd(change));
      }, []);
      setSubChatMsgs(addedMsgs);
      return unsub;
    });
  }, [docId, id]);

  return subChatMsgs;
};

/**
██╗   ██╗████████╗██╗██╗     ██╗████████╗██╗   ██╗
██║   ██║╚══██╔══╝██║██║     ██║╚══██╔══╝╚██╗ ██╔╝
██║   ██║   ██║   ██║██║     ██║   ██║    ╚████╔╝ 
██║   ██║   ██║   ██║██║     ██║   ██║     ╚██╔╝  
╚██████╔╝   ██║   ██║███████╗██║   ██║      ██║   
 ╚═════╝    ╚═╝   ╚═╝╚══════╝╚═╝   ╚═╝      ╚═╝                                                
 */

/**
 * Adds a size to Google Profile pics URLs.
 */
function addSizeToGoogleProfilePic(url: string): string {
  if (
    url.toString().indexOf("googleusercontent.com") !== -1 &&
    url.toString().indexOf("?") === -1
  ) {
    return url + "?sz=150";
  }
  return url;
}

/**
 * Returns true if a user is signed-in.
 */
function isUserSignedIn() {
  return !!getAuth().currentUser;
}

/**
 ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗ ███╗   ██╗███████╗███╗   ██╗████████╗
██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗████╗  ██║██╔════╝████╗  ██║╚══██╔══╝
██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║██╔██╗ ██║█████╗  ██╔██╗ ██║   ██║   
██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║██║╚██╗██║██╔══╝  ██║╚██╗██║   ██║   
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝██║ ╚████║███████╗██║ ╚████║   ██║   
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═══╝   ╚═╝   
 */

/**
██████╗ ██████╗  ██████╗ ███████╗██╗██╗     ███████╗    ██████╗ ██╗ ██████╗
██╔══██╗██╔══██╗██╔═══██╗██╔════╝██║██║     ██╔════╝    ██╔══██╗██║██╔════╝
██████╔╝██████╔╝██║   ██║█████╗  ██║██║     █████╗      ██████╔╝██║██║     
██╔═══╝ ██╔══██╗██║   ██║██╔══╝  ██║██║     ██╔══╝      ██╔═══╝ ██║██║     
██║     ██║  ██║╚██████╔╝██║     ██║███████╗███████╗    ██║     ██║╚██████╗
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝ ╚═════╝
                                                                           
 */

/**
 * ProfilePicUrl
 */
export const ProfilePic: React.FC = () => {
  const setProfilePicUrlState = useSetRecoilState(profilePicUrlState);
  const profilePicUrl = useRecoilValue(profilePicUrlState);
  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (user) => {
    const url: string = getProfilePicUrl();
    const addedUrl = addSizeToGoogleProfilePic(url);
    setProfilePicUrlState(addedUrl);
  });

  // 😭avater
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      {/* 😭avater */}
      <div>
        <IconButton
          aria-label="avater"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Avatar
            aria-label="recipe"
            alt="profilePic"
            src={profilePicUrl}
          ></Avatar>
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {!isUserSignedIn() && (
            <MenuItem
              onClick={() => {
                signIn();
                handleClose();
              }}
            >
              Sign in
            </MenuItem>
          )}
          {isUserSignedIn() && (
            <MenuItem
              onClick={() => {
                signOutUser();
                handleClose();
              }}
            >
              Sign out
            </MenuItem>
          )}
        </Menu>
      </div>
      {/* <Avatar alt="Remy Sharp" src={profilePicUrl} /> */}
    </div>
  );
};

/**
 * Username
 */
export const UserName: React.FC = () => {
  const setUserNameState = useSetRecoilState(userNameState);
  const userName = useRecoilValue(userNameState);
  const auth = getAuth(firebaseApp);
  onAuthStateChanged(auth, (user) => {
    const name: string = getUserName();
    setUserNameState(name);
  });
  return <div>{userName.toString()}</div>;
};

/**
 * Chat Message Normal Layout
 */
// TODO Rename to ChatMsgNormalLayout
export const ChatMsgNormalEle: React.FC<{ msg: ChatMsgState }> = (props) => {
  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);

  // 全体のChatのMessageのDecoのCSS設定
  const cssChatMsgDeco = useRecoilValue(cssChatMsgDecoState);

  if (!props.msg) return <></>;

  return (
    <>
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
        <Stack spacing={2} direction="row">
          <Box>
            {props.msg.profilePicUrl && (
              <Avatar
                alt="profilePic"
                src={props.msg.profilePicUrl}
                sx={{ width: 48, height: 48 }}
              />
            )}
          </Box>

          <Stack spacing={2} direction="row">
            {props.msg.name && <div>{props.msg.name}</div>}
            {props.msg.date && <time>{props.msg.date.toString()}</time>}
          </Stack>
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
    </>
  );
};

/**
 * Chat Message Recipi Layout
 */
//TODO move to ThemeParts.tsx
export const ChatMsgRecipiLayout: React.FC<{
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

export const SubChatMsgRecipiLayout: React.FC<{
  msg: ChatMsgState;
}> = (props) => {
  // CSS設定
  const cssSubChatMsg = useRecoilValue(cssSubChatMsgState);

  if (!props.msg) return <></>;

  return (
    <>
      <div
        css={css`
          ${cssSubChatMsg}
        `}
      >
        <span>
          {props.msg.profilePicUrl && (
            <div
              css={css`
                display: flex;
              `}
            >
              <Avatar
                alt="profilePic"
                src={props.msg.profilePicUrl}
                sx={{ width: 24, height: 24 }}
              />
              <TextField
                multiline
                fullWidth
                variant="standard"
                value={props.msg.chatTxt}
              />
            </div>
          )}
        </span>
      </div>
    </>
  );
};

/**
███████╗███████╗████████╗
██╔════╝██╔════╝╚══██╔══╝
███████╗█████╗     ██║   
╚════██║██╔══╝     ██║   
███████║███████╗   ██║   
╚══════╝╚══════╝   ╚═╝   
 */

/**
 ██████╗██╗  ██╗ █████╗ ████████╗
██╔════╝██║  ██║██╔══██╗╚══██╔══╝
██║     ███████║███████║   ██║   
██║     ██╔══██║██╔══██║   ██║   
╚██████╗██║  ██║██║  ██║   ██║   
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
                                 
 */
export const CHAT_MSG_COL_NAME = "chat-msgs";
export const SUB_CHAT_MSG_COL_NAME = "sub-chat-msgs";

const chatMsg = (chat: { docRef: any; chatTxt: string; title: string }) => {
  const date = dayjs(Timestamp.fromDate(new Date()).toDate()).format(
    "YYYY/MM/DD ddd HH:mm:ss"
  );
  const { docRef, chatTxt, title } = chat;
  return {
    firebaseId: docRef.id,
    name: getUserName(),
    chatTxt: chatTxt,
    title: title,
    profilePicUrl: getProfilePicUrl(),
    date: date.toString(),
  };
};

// TODO Rename to setChatMsg
export const setChatMsg = async (chatTxt: any, title: any) => {
  try {
    const docRef = doc(collection(db, CHAT_MSG_COL_NAME));
    await setDoc(
      docRef,
      chatMsg({
        docRef: docRef,
        chatTxt: chatTxt,
        title: title,
      })
    );
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
};

export const setSubChatMsg = async (chatTxt: string, docId: string) => {
  const date = dayjs(Timestamp.fromDate(new Date()).toDate()).format(
    "YYYY/MM/DD ddd HH:mm:ss"
  );
  const db = getFirestore();
  const docRef = doc(db, CHAT_MSG_COL_NAME, docId);
  const colRef = collection(docRef, SUB_CHAT_MSG_COL_NAME);
  const subDocRef = doc(colRef);
  console.log(subDocRef.id);
  try {
    await setDoc(
      subDocRef,
      chatMsg({
        docRef: subDocRef,
        chatTxt: chatTxt,
        title: "",
      })
    );
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
};

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
export const setImgMsg = async (event: any) => {
  event.preventDefault();
  let file = event.target.files[0];

  let LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";
  try {
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    const messageRef = await addDoc(collection(getFirestore(), "messages"), {
      name: getUserName(),
      imageUrl: LOADING_IMAGE_URL,
      profilePicUrl: getProfilePicUrl(),
      timestamp: serverTimestamp(),
    });

    // 2 - Upload the image to Cloud Storage.
    const filePath = `${getAuth().currentUser?.uid}/${messageRef.id}/${
      file.name
    }`;
    const newImageRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);

    // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);

    // 4 - Update the chat message placeholder with the image's URL.
    await updateDoc(messageRef, {
      imageUrl: publicImageUrl,
      storageUri: fileSnapshot.metadata.fullPath,
    });
  } catch (error) {
    console.error(
      "There was an error uploading a file to Cloud Storage:",
      error
    );
  }
};
