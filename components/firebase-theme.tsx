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
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import React, { useState, useEffect, useRef } from "react";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  Unsubscribe,
} from "firebase/auth";
import dayjs from "dayjs";
import { Box, Stack, Button, TextField, Avatar } from "@mui/material";
import { css } from "@emotion/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { cssMsgsState, cssMsgState, cssTextState } from "../atoms/cssMsgStates";
import { MsgState, Msg } from "../types";

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
export const useCssMsgs = () => {
  const setMsgs = useSetRecoilState(cssMsgsState);
  const msgs = useRecoilValue(cssMsgsState);
  const LIMIT = 24;

  useEffect(() => {
    // Create the query to load the last 12 messages and listen for new ones.
    const recentMessagesQuery = query(
      collection(getFirestore(), "cssMsgs"),
      orderBy("timestamp", "desc"),
      limit(LIMIT)
    );
    // Start listening to the query.
    const unsub: Unsubscribe = onSnapshot(recentMessagesQuery, (snapshot) => {
      let addedMsgs: Msg[] = [];
      snapshot.docs.map((change) => {
        const message = change.data();
        addedMsgs.push({
          id: change.id,
          timestamp: message.timestamp,
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
 ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗ ███╗   ██╗███████╗███╗   ██╗████████╗
██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗████╗  ██║██╔════╝████╗  ██║╚══██╔══╝
██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║██╔██╗ ██║█████╗  ██╔██╗ ██║   ██║   
██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║██║╚██╗██║██╔══╝  ██║╚██╗██║   ██║   
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝██║ ╚████║███████╗██║ ╚████║   ██║   
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═══╝   ╚═╝   
                                                                                  
 */

/**
 ██████╗ ██████╗ ███╗   ███╗██████╗      ██████╗ ███████╗████████╗
██╔════╝██╔═══██╗████╗ ████║██╔══██╗    ██╔════╝ ██╔════╝╚══██╔══╝
██║     ██║   ██║██╔████╔██║██████╔╝    ██║  ███╗█████╗     ██║   
██║     ██║   ██║██║╚██╔╝██║██╔═══╝     ██║   ██║██╔══╝     ██║   
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║         ╚██████╔╝███████╗   ██║   
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝          ╚═════╝ ╚══════╝   ╚═╝   
                                                                  
 */

/**
 * message
 */
export const CssMsg: React.FC<{ msg: MsgState }> = (props) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(
      dayjs(props.msg?.timestamp?.toDate()).format("YYYY/MM/DD ddd HH:mm:ss")
    );
  }, [props.msg?.timestamp]);

  if (!props.msg) return <></>;

  return (
    <>
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

        <Box>
          <Stack spacing={2} direction="row">
            {props.msg.name && <div>{props.msg.name}</div>}
            {props.msg.timestamp && <time dateTime={time}>{time}</time>}
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
 ██████╗ ██████╗ ███╗   ███╗██████╗     ███████╗███████╗████████╗
██╔════╝██╔═══██╗████╗ ████║██╔══██╗    ██╔════╝██╔════╝╚══██╔══╝
██║     ██║   ██║██╔████╔██║██████╔╝    ███████╗█████╗     ██║   
██║     ██║   ██║██║╚██╔╝██║██╔═══╝     ╚════██║██╔══╝     ██║   
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║         ███████║███████╗   ██║   
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝         ╚══════╝╚══════╝   ╚═╝   
                                                                 
 */

/**
 *
 */
export const SetCssTextToAtomBtn = (msg: any) => {
  // const setMsg = useSetRecoilState(cssMsgState);
  const setCssTextState = useSetRecoilState(cssTextState);
  return (
    <>
      {/* TODO msg.msg.text */}
      <Button onClick={() => setCssTextState(msg.msg.text)}>Set</Button>
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
export const setCssMsg = async (msgText: any) => {
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), "cssMsgs"), {
      name: getUserName(),
      text: msgText,
      profilePicUrl: getProfilePicUrl(),
      timestamp: serverTimestamp(),
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
