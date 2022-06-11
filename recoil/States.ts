import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";
import { CssMsgState, ThemeUiTargetId } from "../types";
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
  key: "States", // this key is using to store data in local storage
});

/**
 ██████╗███████╗███████╗
██╔════╝██╔════╝██╔════╝
██║     ███████╗███████╗
██║     ╚════██║╚════██║
╚██████╗███████║███████║
 ╚═════╝╚══════╝╚══════╝
                        
 */

// TODO defaultの中にcss項目を増やす

export const cssBackgroundState = atom({
  key: "cssBackgroundState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const cssTopbarState = atom({
  key: "cssTopbarState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const cssTopbarDecoState = atom({
  key: "cssTopbarDecoState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const cssChatMsgState = atom({
  key: "cssChatMsgState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const cssChatMsgDecoState = atom({
  key: "cssChatMsgDecoState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

/**
     ██╗███████╗ ██████╗ ███╗   ██╗
     ██║██╔════╝██╔═══██╗████╗  ██║
     ██║███████╗██║   ██║██╔██╗ ██║
██   ██║╚════██║██║   ██║██║╚██╗██║
╚█████╔╝███████║╚██████╔╝██║ ╚████║
 ╚════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝
                                   
 */

/**
███╗   ███╗███████╗ ██████╗ 
████╗ ████║██╔════╝██╔════╝ 
██╔████╔██║███████╗██║  ███╗
██║╚██╔╝██║╚════██║██║   ██║
██║ ╚═╝ ██║███████║╚██████╔╝
╚═╝     ╚═╝╚══════╝ ╚═════╝ 
                            
 */

export const cssMsgState = atom<CssMsgState>({
  key: "cssMsgState",
  default: {
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
  },
});

/**
██╗██████╗ 
██║██╔══██╗
██║██║  ██║
██║██║  ██║
██║██████╔╝
╚═╝╚═════╝ 
           
 */

export const editCssTargetIdState = atom<ThemeUiTargetId>({
  key: "editCssTargetIdState",
  default: "cssBackground",
});
