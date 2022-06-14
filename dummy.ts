import { Msg, CssMsg } from "./types";
import { Timestamp } from "firebase/firestore";

export const dummyMsg: Msg = {
  id: "dummy id",
  date: new Date(),
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
  profilePicUrl: "",
  imageUrl: "",
};

export const dummyCss = "";

export const dummyJson = {};
