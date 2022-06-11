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

/**
███╗   ███╗███████╗ ██████╗ 
████╗ ████║██╔════╝██╔════╝ 
██╔████╔██║███████╗██║  ███╗
██║╚██╔╝██║╚════██║██║   ██║
██║ ╚═╝ ██║███████║╚██████╔╝
╚═╝     ╚═╝╚══════╝ ╚═════╝ 
                            
 */

//TODO delete msg type
export type Msg = {
  id: string;
  date: Date;
  name: string;
  text: string;
  profilePicUrl: string;
  imageUrl: string;
};
export type MsgState = Msg | null;

export type ChatMsg = {
  id: string;
  timestamp: Timestamp;
  name: string;
  text: string;
  profilePicUrl: string;
  imageUrl?: string;
};
export type ChatMsgState = ChatMsg | null;

export type ImgMsg = {
  id: string;
  timestamp: Timestamp;
  name: string;
  text?: string;
  profilePicUrl: string;
  imageUrl: string;
};
export type ImgMsgState = ImgMsg | null;

export type CssMsg = {
  id?: string;
  timestamp: any;
  name: string;
  cssBackground: string;
  cssTopbar: string;
  cssTopbarDeco: string;
  cssChatMsg: string;
  cssChatMsgDeco: string;
  profilePicUrl: string;
  imageUrl?: string;
};

export type CssMsgState = CssMsg | null;

/**
██╗██████╗ 
██║██╔══██╗
██║██║  ██║
██║██║  ██║
██║██████╔╝
╚═╝╚═════╝ 
           
 */

//TODO Rename TypeThemeUiTargetId
export type ThemeUiTargetId =
  | "cssBackground"
  | "cssTopbar"
  | "cssTopbarDeco"
  | "cssChatMsg"
  | "cssChatMsgDeco";

/**
██████╗  █████╗ ██████╗ ██╗ ██████╗     ██████╗ ████████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗██║██╔═══██╗    ██╔══██╗╚══██╔══╝████╗  ██║
██████╔╝███████║██║  ██║██║██║   ██║    ██████╔╝   ██║   ██╔██╗ ██║
██╔══██╗██╔══██║██║  ██║██║██║   ██║    ██╔══██╗   ██║   ██║╚██╗██║
██║  ██║██║  ██║██████╔╝██║╚██████╔╝    ██████╔╝   ██║   ██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝ ╚═════╝     ╚═════╝    ╚═╝   ╚═╝  ╚═══╝
                                                                   
 */

export type ChatRadioBtnId = "Normal" | "Recipe";
