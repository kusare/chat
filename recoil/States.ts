import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";
import {
  MsgState,
  CssMsgState,
  ThemeUiTargetId,
  ChatRadioBtnId,
} from "../types";
import { recoilPersist } from "recoil-persist";
import { dummyMsg, dummyCssMsg } from "../dummy";

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
export const msgsState = atom<MsgState[]>({
  key: "msgsState",
  default: [dummyMsg],
});

export const subChatMsgsState = atom<MsgState[]>({
  key: "subChatMsgsState",
  default: [dummyMsg],
});

export const cssMsgState = atom<CssMsgState>({
  key: "cssMsgState",
  default: dummyCssMsg,
});

export const cssSubMsgState = atom<CssMsgState>({
  key: "cssSubMsgState",
  default: dummyCssMsg,
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
  effects_UNSTABLE: [persistAtom],
});

// TODO Rename to chatLayoutIdState
export const chatRadioBtnIdState = atom<ChatRadioBtnId>({
  key: "chatRadioBtnIdState",
  default: "Normal",
  effects_UNSTABLE: [persistAtom],
});
