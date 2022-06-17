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
import {
  cssBackgroundState,
  cssTopbarState,
  cssTopbarDecoState,
  cssChatMsgState,
  cssChatMsgDecoState,
  editCssTargetIdState,
  cssChatMsgTitleDecoState,
} from "../recoil/States";
import {
  ChatMsgState,
  ChatMsg,
  CssMsgState,
  CssMsg,
  ImgMsg,
  ImgMsgState,
  ThemeUiTargetId,
} from "../types";
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
import { Input } from "@mui/material";
import { State } from "pixi.js";
// @ts-ignore
import { toCSS, toJSON } from "cssjson";
import { SketchPicker, ColorResult } from "react-color";

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
██╗   ██╗███████╗███████╗     ██████╗███████╗███████╗    ███╗   ███╗███████╗ ██████╗ ███████╗
██║   ██║██╔════╝██╔════╝    ██╔════╝██╔════╝██╔════╝    ████╗ ████║██╔════╝██╔════╝ ██╔════╝
██║   ██║███████╗█████╗      ██║     ███████╗███████╗    ██╔████╔██║███████╗██║  ███╗███████╗
██║   ██║╚════██║██╔══╝      ██║     ╚════██║╚════██║    ██║╚██╔╝██║╚════██║██║   ██║╚════██║
╚██████╔╝███████║███████╗    ╚██████╗███████║███████║    ██║ ╚═╝ ██║███████║╚██████╔╝███████║
 ╚═════╝ ╚══════╝╚══════╝     ╚═════╝╚══════╝╚══════╝    ╚═╝     ╚═╝╚══════╝ ╚═════╝ ╚══════╝
                                                                                             
 */

/**
 *
 */
export const useGetCssMsgs = (id: string) => {
  const [cssMsgs, setCssMsgs] = useState<CssMsgState[]>([]);
  /**
██╗     ██╗███╗   ███╗██╗████████╗
██║     ██║████╗ ████║██║╚══██╔══╝
██║     ██║██╔████╔██║██║   ██║   
██║     ██║██║╚██╔╝██║██║   ██║   
███████╗██║██║ ╚═╝ ██║██║   ██║   
╚══════╝╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   
                                  
 */
  // ロードするメッセージの数
  // Number of messages to load
  const LIMIT = 6;

  useEffect(() => {
    // Create the query to load the last 12 messages and listen for new ones.
    const recentMessagesQuery = query(
      // collection(getFirestore(), "cssMsgs"),
      collection(getFirestore(), id),
      orderBy("timestamp", "desc"),
      limit(LIMIT)
    );
    // Start listening to the query.
    const unsub: Unsubscribe = onSnapshot(recentMessagesQuery, (snapshot) => {
      let addedMsgs: CssMsg[] = [];
      snapshot.docs.map((change) => {
        const message = change.data();
        addedMsgs.push({
          id: change.id,
          timestamp: message.timestamp,
          name: message.name,
          cssBackground: message.cssBackground,
          cssTopbar: message.cssTopbar,
          cssTopbarDeco: message.cssTopbarDeco,
          cssChatMsg: message.cssChatMsg,
          cssChatMsgDeco: message.cssChatMsgDeco,
          profilePicUrl: message.profilePicUrl,
          imageUrl: message.imageUrl,
        });
      }, []);
      setCssMsgs(addedMsgs);
      return unsub;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return cssMsgs;
};

/**
██╗   ██╗███████╗███████╗    ██╗███╗   ███╗ ██████╗     ███╗   ███╗███████╗ ██████╗ ███████╗
██║   ██║██╔════╝██╔════╝    ██║████╗ ████║██╔════╝     ████╗ ████║██╔════╝██╔════╝ ██╔════╝
██║   ██║███████╗█████╗      ██║██╔████╔██║██║  ███╗    ██╔████╔██║███████╗██║  ███╗███████╗
██║   ██║╚════██║██╔══╝      ██║██║╚██╔╝██║██║   ██║    ██║╚██╔╝██║╚════██║██║   ██║╚════██║
╚██████╔╝███████║███████╗    ██║██║ ╚═╝ ██║╚██████╔╝    ██║ ╚═╝ ██║███████║╚██████╔╝███████║
 ╚═════╝ ╚══════╝╚══════╝    ╚═╝╚═╝     ╚═╝ ╚═════╝     ╚═╝     ╚═╝╚══════╝ ╚═════╝ ╚══════╝
                                                                                            
 */

/**
 *
 */
export const useImgMsgs = (id: string) => {
  const [imgMsgs, setImgMsgs] = useState<ImgMsgState[]>([]);
  /**
██╗     ██╗███╗   ███╗██╗████████╗
██║     ██║████╗ ████║██║╚══██╔══╝
██║     ██║██╔████╔██║██║   ██║   
██║     ██║██║╚██╔╝██║██║   ██║   
███████╗██║██║ ╚═╝ ██║██║   ██║   
╚══════╝╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   
                                  
 */
  // ロードするメッセージの数
  // Number of messages to load
  const LIMIT = 6;

  useEffect(() => {
    // Create the query to load the last 12 messages and listen for new ones.
    const recentMessagesQuery = query(
      // collection(getFirestore(), "cssMsgs"),
      collection(getFirestore(), id),
      orderBy("timestamp", "desc"),
      limit(LIMIT)
    );
    // Start listening to the query.
    const unsub: Unsubscribe = onSnapshot(recentMessagesQuery, (snapshot) => {
      let addedMsgs: ImgMsg[] = [];
      snapshot.docs.map((change) => {
        const message = change.data();
        addedMsgs.push({
          id: change.id,
          timestamp: message.timestamp,
          name: message.name,
          profilePicUrl: message.profilePicUrl,
          imageUrl: message.imageUrl,
        });
      }, []);
      setImgMsgs(addedMsgs);
      return unsub;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return imgMsgs;
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
 ██████╗ ███████╗████████╗     ██████╗ ██████╗ ███╗   ███╗██████╗ 
██╔════╝ ██╔════╝╚══██╔══╝    ██╔════╝██╔═══██╗████╗ ████║██╔══██╗
██║  ███╗█████╗     ██║       ██║     ██║   ██║██╔████╔██║██████╔╝
██║   ██║██╔══╝     ██║       ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ 
╚██████╔╝███████╗   ██║       ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     
 ╚═════╝ ╚══════╝   ╚═╝        ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     
                                                                  
 */

/**
 ██████╗ ███████╗████████╗     ██████╗███████╗███████╗    ███╗   ███╗███████╗ ██████╗ 
██╔════╝ ██╔════╝╚══██╔══╝    ██╔════╝██╔════╝██╔════╝    ████╗ ████║██╔════╝██╔════╝ 
██║  ███╗█████╗     ██║       ██║     ███████╗███████╗    ██╔████╔██║███████╗██║  ███╗
██║   ██║██╔══╝     ██║       ██║     ╚════██║╚════██║    ██║╚██╔╝██║╚════██║██║   ██║
╚██████╔╝███████╗   ██║       ╚██████╗███████║███████║    ██║ ╚═╝ ██║███████║╚██████╔╝
 ╚═════╝ ╚══════╝   ╚═╝        ╚═════╝╚══════╝╚══════╝    ╚═╝     ╚═╝╚══════╝ ╚═════╝ 
                                                                                      
 */

/**
 * message
 */
export const GetCssMsg: React.FC<{ msg: CssMsgState }> = (props) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(
      dayjs(props.msg?.timestamp?.toDate()).format("YYYY/MM/DD ddd HH:mm:ss")
    );
  }, [props.msg?.timestamp]);

  //  💅CSS to Return
  // 全体のCSS設定にする予定
  // const cssText = useRecoilValue(cssBackgroundState);

  // 😭avater
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  // (props) CSS to Json
  const [cssJson, setCssJson] = useState(
    toJSON(props?.msg?.cssBackground).attributes
  );

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
  ``;
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
  };

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
      <Card
        sx={{ maxWidth: 345 }}
        css={css`
          ${props.msg.cssBackground}
        `}
      >
        {/* 💅CSS Sheet` */}
        <CardContent>
          <p
            css={css`
              ${props.msg.cssChatMsg}
            `}
          >
            {
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.吾輩わがはいは猫である。名前はまだ無い。どこで生れたかとんと見当けんとうがつかぬ。"
            }
          </p>
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
              <Box>
                <Input
                  type="file"
                  onChange={(e) => setCssImg(e, "cssImgMsgs")}
                />
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
                <p
                  css={css`
                    ${cssEdited}
                  `}
                >
                  {cssEdited}
                </p>
                <SketchPicker
                  color={colorPicked}
                  onChange={handleColorPicked}
                />
              </Box>
            </Modal>
          </div>
        </CardActions>
      </Card>
    </>
  );
};
/**
 ██████╗ ███████╗████████╗     ██████╗███████╗███████╗    ██╗███╗   ███╗ ██████╗ 
██╔════╝ ██╔════╝╚══██╔══╝    ██╔════╝██╔════╝██╔════╝    ██║████╗ ████║██╔════╝ 
██║  ███╗█████╗     ██║       ██║     ███████╗███████╗    ██║██╔████╔██║██║  ███╗
██║   ██║██╔══╝     ██║       ██║     ╚════██║╚════██║    ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗   ██║       ╚██████╗███████║███████║    ██║██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝   ╚═╝        ╚═════╝╚══════╝╚══════╝    ╚═╝╚═╝     ╚═╝ ╚═════╝ 
                                                                                 
 */

/**
███████╗███████╗████████╗     ██████╗ ██████╗ ███╗   ███╗██████╗ 
██╔════╝██╔════╝╚══██╔══╝    ██╔════╝██╔═══██╗████╗ ████║██╔══██╗
███████╗█████╗     ██║       ██║     ██║   ██║██╔████╔██║██████╔╝
╚════██║██╔══╝     ██║       ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ 
███████║███████╗   ██║       ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     
╚══════╝╚══════╝   ╚═╝        ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     
                                                                 
 */

/**
███████╗███████╗████████╗     ██████╗███████╗███████╗    ████████╗██╗  ██╗████████╗
██╔════╝██╔════╝╚══██╔══╝    ██╔════╝██╔════╝██╔════╝    ╚══██╔══╝╚██╗██╔╝╚══██╔══╝
███████╗█████╗     ██║       ██║     ███████╗███████╗       ██║    ╚███╔╝    ██║   
╚════██║██╔══╝     ██║       ██║     ╚════██║╚════██║       ██║    ██╔██╗    ██║   
███████║███████╗   ██║       ╚██████╗███████║███████║       ██║   ██╔╝ ██╗   ██║   
╚══════╝╚══════╝   ╚═╝        ╚═════╝╚══════╝╚══════╝       ╚═╝   ╚═╝  ╚═╝   ╚═╝   

 */

/**
 *
 */
export const SetCssTextToAtomBtn = (props: { msg: CssMsg }) => {
  // 全体の背景のCSS設定はcssBackgroundStateから
  const setCssBackgroundState = useSetRecoilState(cssBackgroundState);
  // 全体のtopbarのCSS設定
  const setCssTopbarState = useSetRecoilState(cssTopbarState);
  // 全体のtopbarのCSS設定
  const setCssTopbarDecoState = useSetRecoilState(cssTopbarDecoState);
  // 全体のChatのMessageのCSS設定
  const setCssChatMsgState = useSetRecoilState(cssChatMsgState);
  // 全体のChatのMessageのDecoのCSS設定
  const setCssChatMsgDecoState = useSetRecoilState(cssChatMsgDecoState);

  // TODO　どのようにrecoilに反映されてるか確認
  const updateWholeCss = () => {
    setCssBackgroundState(props.msg.cssBackground);
    setCssTopbarState(props.msg.cssTopbar);
    setCssTopbarDecoState(props.msg.cssTopbarDeco);
    setCssChatMsgState(props.msg.cssChatMsg);
    setCssChatMsgDecoState(props.msg.cssChatMsgDeco);
  };
  return (
    <>
      <Button onClick={() => updateWholeCss()}>Set</Button>
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

// TODO move to types.ts
type CssMsgArg = {
  cssBackground: string;
  cssTopbar: string;
  cssTopbarDeco: string;
  cssChatMsg: string;
  cssChatMsgDeco: string;
};

// Saves a new message to Cloud Firestore.
export const setCssMsg = async (arg: CssMsgArg) => {
  const cssMsgForAdd: CssMsg = {
    timestamp: serverTimestamp(),
    name: getUserName(),
    cssBackground: arg.cssBackground,
    cssTopbar: arg.cssTopbar,
    cssTopbarDeco: arg.cssTopbarDeco,
    cssChatMsg: arg.cssChatMsg,
    cssChatMsgDeco: arg.cssChatMsgDeco,
    profilePicUrl: getProfilePicUrl(),
  };
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), "cssMsgs"), cssMsgForAdd);
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
