import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";
import { CssMsgState, CssMsg } from "../types";
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

export const cssBackgroundState = atom({
  key: "cssBackgroundState",
  // default: "color: black; background-color: #8AA058;",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const cssTopbarState = atom({
  key: "cssTopbarState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const cssChatMsgState = atom({
  key: "cssChatMsgState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const cssMsgState = atom<CssMsgState>({
  key: "cssMsgState",
  default: {
    id: "",
    timestamp: Timestamp.fromDate(new Date()),
    name: "",
    cssBackground: "",
    cssTopbar: "",
    cssChatMsg: "",
    profilePicUrl: "",
    imageUrl: "",
  },
});
