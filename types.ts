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

export type Msg = {
  id: string;
  timestamp: Timestamp;
  name: string;
  text: string;
  profilePicUrl: string;
  imageUrl: string;
};
export type MsgState = Msg | null;
