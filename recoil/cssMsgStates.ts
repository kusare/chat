import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";
import { MsgState, Msg } from "../types";
import { recoilPersist } from "recoil-persist";

/**
██████╗ ███████╗ ██████╗ ██████╗ ██╗██╗         ██████╗ ███████╗██████╗ ███████╗██╗███████╗████████╗
██╔══██╗██╔════╝██╔════╝██╔═══██╗██║██║         ██╔══██╗██╔════╝██╔══██╗██╔════╝██║██╔════╝╚══██╔══╝
██████╔╝█████╗  ██║     ██║   ██║██║██║         ██████╔╝█████╗  ██████╔╝███████╗██║███████╗   ██║   
██╔══██╗██╔══╝  ██║     ██║   ██║██║██║         ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║██║╚════██║   ██║   
██║  ██║███████╗╚██████╗╚██████╔╝██║███████╗    ██║     ███████╗██║  ██║███████║██║███████║   ██║   
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝    ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚══════╝   ╚═╝   
                                                                                                    
 */
const { persistAtom } = recoilPersist({
  key: "cssMsgStates", // this key is using to store data in local storage
});

export const cssTextState = atom({
  key: "cssTextState",
  // default: "color: black; background-color: #8AA058;",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const cssMsgState = atom<MsgState>({
  key: "cssMsgState",
  default: {
    id: "",
    timestamp: Timestamp.fromDate(new Date()),
    name: "",
    text: "",
    profilePicUrl: "",
    imageUrl: "",
  },
});
export const cssMsgsState = atom<MsgState[]>({
  key: "cssMsgsState",
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