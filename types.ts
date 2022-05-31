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
  cssChatMsg: string;
  profilePicUrl: string;
  imageUrl?: string;
};

export type CssMsgState = CssMsg | null;
