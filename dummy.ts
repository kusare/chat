import { ChatMsg, CssMsg } from "./types";
import { Timestamp } from "firebase/firestore";

//TODO rename dummyChatMsg
export const dummyMsg: ChatMsg = {
  id: "dummy id",
  date: Timestamp.fromDate(new Date()).toDate(),
  name: "dummy name",
  text: "dummy text",
  title: "dummy title",
  chatTxt: "dummy chatTxt",
  profilePicUrl: "dummy url",
  imageUrl: "image url dummy",
};

export const dummyCssMsg: CssMsg = {
  id: "",
  timestamp: Timestamp.fromDate(new Date()),
  name: "",
  cssBackground: "",
  cssTopbar: "",
  cssTopbarDeco: "",
  cssChatMsg: "",
  cssChatMsgDeco: "",
  cssSubChatMsg: "",
  cssChatMsgTitleDeco: "",
  profilePicUrl: "",
  imageUrl: "",
};

export const dummyCss = "";

export const dummyJson = {};
