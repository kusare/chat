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
import { Box, Stack, Button, TextField, Avatar } from "@mui/material";
import { css } from "@emotion/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { Msg, MsgState } from "../types";
import {
  cssBackgroundState,
  cssTopbarState,
  cssChatMsgState,
  cssChatMsgDecoState,
} from "../recoil/States";

// TODO move to recoil/States
export const profilePicUrlState = atom<string>({
  key: "profilePicUrState", // unique ID (with respect to other atoms/selectors)
  default: "/images/profile_placeholder.png", // default value (aka initial value)
});

export const userNameState = atom<string>({
  key: "userNameState", // unique ID (with respect to other atoms/selectors)
  default: "NO NAME", // default value (aka initial value)
});

export const msgState = atom<MsgState>({
  key: "msgState",
  default: {
    id: "",
    date: Timestamp.fromDate(new Date()).toDate(),
    name: "",
    text: "",
    profilePicUrl: "",
    imageUrl: "",
  },
});

export const msgsState = atom<MsgState[]>({
  key: "msgsState",
  default: [
    {
      id: "",
      date: Timestamp.fromDate(new Date()).toDate(),
      name: "",
      text: "",
      profilePicUrl: "",
      imageUrl: "",
    },
  ],
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
 * Firebase Initialize
 */
export const firebaseApp: FirebaseApp = !getApps().length
  ? initializeApp(firebaseAppConfig)
  : getApp();

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
// TODO for chat or img
export const useGetMsgs = () => {
  const setMsgs = useSetRecoilState(msgsState);
  const msgs = useRecoilValue(msgsState);
  const LIMIT = 24;

  useEffect(() => {
    // Create the query to load the last 12 messages and listen for new ones.
    const recentMessagesQuery = query(
      collection(getFirestore(), "ChatMsgs"),
      orderBy("date", "desc"),
      limit(LIMIT)
    );
    // Start listening to the query.
    const unsub: Unsubscribe = onSnapshot(recentMessagesQuery, (snapshot) => {
      let addedMsgs: Msg[] = [];
      snapshot.docs.map((change) => {
        const message = change.data();
        addedMsgs.push({
          id: change.id,
          date: message.date,
          name: message.name,
          text: message.text,
          profilePicUrl: message.profilePicUrl,
          imageUrl: message.imageUrl,
        });
      }, []);
      setMsgs(addedMsgs);
      return unsub;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return msgs;
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
export const ChatMsgEle: React.FC<{ msg: MsgState }> = (props) => {
  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);

  // 全体のChatのMessageのDecoのCSS設定
  const cssChatMsgDeco = useRecoilValue(cssChatMsgDecoState);

  // const [time, setTime] = useState("");

  // useEffect(() => {
  //   setTime(props.msg?.date);
  // }, [props.msg?.date]);

  if (!props.msg) return <></>;

  return (
    <>
      <div
        css={css`
          ${cssChatMsgDeco}
        `}
      >{`planned cssChatMsgDeco`}</div>
      <Stack
        spacing={2}
        direction="row"
        css={css`
          ${cssChatMsg}
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
          <TextField
            multiline
            placeholder="No Comment"
            maxRows={4}
            value={props.msg.text}
          />
        </Box>
      </Stack>
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
export const ChatMsgRecipiLayout: React.FC<{ msg: MsgState }> = (props) => {
  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);

  // 全体のChatのMessageのDecoのCSS設定
  const cssChatMsgDeco = useRecoilValue(cssChatMsgDecoState);

  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(dayjs(props.msg?.date).format("YYYY/MM/DD ddd HH:mm:ss"));
  }, [props.msg?.date]);

  if (!props.msg) return <></>;

  return (
    <>
      <div
        css={css`
          ${cssChatMsgDeco}
        `}
      >{`planned cssChatMsgDeco`}</div>
      <Stack
        spacing={2}
        direction="row"
        css={css`
          ${cssChatMsg}
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
            {props.msg.date && <time dateTime={time}>{time}</time>}
          </Stack>
          <TextField
            multiline
            placeholder="No Comment"
            maxRows={4}
            value={props.msg.text}
          />
        </Box>
      </Stack>
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
███████╗███████╗████████╗
██╔════╝██╔════╝╚══██╔══╝
███████╗█████╗     ██║   
╚════██║██╔══╝     ██║   
███████║███████╗   ██║   
╚══════╝╚══════╝   ╚═╝   
 */

// Saves a new message to Cloud Firestore.
export const setMsg = async (msgText: any) => {
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), "ChatMsgs"), {
      name: getUserName(),
      text: msgText,
      profilePicUrl: getProfilePicUrl(),
      // date: dayjs(Timestamp.fromDate(new Date()).toDate()).format(
      //   "YYYY/MM/DD ddd HH:mm:ss"
      // ),
      date: dayjs(Timestamp.fromDate(new Date()).toDate()),
    });
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
