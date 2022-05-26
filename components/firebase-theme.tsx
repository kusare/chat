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

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import FilterVintageIcon from "@mui/icons-material/FilterVintage";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import PowerIcon from "@mui/icons-material/Power";
import Modal from "@mui/material/Modal";

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
 ██████╗███████╗███████╗    ███╗   ███╗███████╗ ██████╗ 
██╔════╝██╔════╝██╔════╝    ████╗ ████║██╔════╝██╔════╝ 
██║     ███████╗███████╗    ██╔████╔██║███████╗██║  ███╗
██║     ╚════██║╚════██║    ██║╚██╔╝██║╚════██║██║   ██║
╚██████╗███████║███████║    ██║ ╚═╝ ██║███████║╚██████╔╝
 ╚═════╝╚══════╝╚══════╝    ╚═╝     ╚═╝╚══════╝ ╚═════╝ 
                                                        
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

  //  💅CSS to Return
  // 全体のCSS設定にする予定
  const cssText = useRecoilValue(cssTextState);

  // 😭avater
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 🖊Edit
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  /**
██████╗ ███████╗████████╗██╗   ██╗██████╗ ███╗   ██╗
██╔══██╗██╔════╝╚══██╔══╝██║   ██║██╔══██╗████╗  ██║
██████╔╝█████╗     ██║   ██║   ██║██████╔╝██╔██╗ ██║
██╔══██╗██╔══╝     ██║   ██║   ██║██╔══██╗██║╚██╗██║
██║  ██║███████╗   ██║   ╚██████╔╝██║  ██║██║ ╚████║
╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
                                                    
 */

  if (!props.msg) return <></>;

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        {/* 💅CSS Sheet` */}
        <CardContent
          css={css`
            * {
              ${props.msg.text}
            }
          `}
        >
          <Typography variant="body2" color="text.secondary">
            {
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.栗は口の病気トォテテテテテイたちをひもを向い療だろた。"
            }
          </Typography>
        </CardContent>
        {/* bottom line */}
        <CardActions disableSpacing>
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
                sx={{ bgcolor: red[500] }}
                aria-label="recipe"
                alt="profilePic"
                src={props.msg.profilePicUrl}
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
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </div>
          {/* 📛profile name */}
          <Typography variant="body2" color="text.secondary">
            {props.msg.name}
          </Typography>
          {/* ⌚time */}
          <Typography variant="body2" color="text.secondary">
            {time}
          </Typography>
          {/* 🖊 Edit */}
          <div>
            <IconButton aria-label="edit" onClick={handleOpenEdit}>
              <EditIcon />
            </IconButton>

            {/* ███╗   ███╗ ██████╗ ██████╗  █████╗ ██╗     
                ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║     
                ██╔████╔██║██║   ██║██║  ██║███████║██║     
                ██║╚██╔╝██║██║   ██║██║  ██║██╔══██║██║     
                ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║  ██║███████╗
                ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
                                             */}
            <Modal
              open={openEdit}
              onClose={handleCloseEdit}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {/* 🖼アップした画像 */}
                {props.msg.imageUrl && (
                  <CardMedia
                    component="img"
                    height="50"
                    sx={{ width: 50 }}
                    image={props.msg.imageUrl}
                    alt="Paella dish"
                  />
                )}
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {props.msg.text}
                </Typography>
              </Box>
            </Modal>
          </div>
        </CardActions>
      </Card>
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
export const setCssImg = async (event: any, id: string) => {
  event.preventDefault();
  let file = event.target.files[0];

  let LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";
  try {
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    const messageRef = await addDoc(collection(getFirestore(), id), {
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
