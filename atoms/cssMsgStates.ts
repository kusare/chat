import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";
import { MsgState, Msg } from "../types";

export const cssTextState = atom({
  key: "cssTextState",
  default: "color: black; background-color: #8AA058;",
});

export const cssMsgState = atom<MsgState>({
  key: "msgState",
  default: {
    id: "",
    timestamp: Timestamp.fromDate(new Date()),
    name: "",
    text: "color: black; background-color: #8AA058;",
    profilePicUrl: "",
    imageUrl: "",
  },
});
export const cssMsgsState = atom<MsgState[]>({
  key: "msgsState",
  default: [
    {
      id: "",
      timestamp: Timestamp.fromDate(new Date()),
      name: "",
      text: "",
      profilePicUrl: "",
      imageUrl: "",
    },
  ],
});
