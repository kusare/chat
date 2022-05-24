import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";
import { MsgState, Msg } from "../types";
import { recoilPersist } from "recoil-persist";
import localforage from "localforage";

localforage.config({
  driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
  name: "myApp",
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: "keyvaluepairs", // Should be alphanumeric, with underscores.
  description: "some description",
});

const customStorage = () => {
  return {
    setItem: (key: any, value: any) => {
      // handle setItem
      localforage.setItem(key, value);
      // if err is non-null, we got an error
    },
    getItem: (key: any) => {
      // handle getItem
      // this function should return something
      const a = localforage.getItem(key, function (err, value) {
        // if err is non-null, we got an error. otherwise, value is the value
      });
      return a;
    },
    clear: () => {
      // clear the whole db
    },
  };
};

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
  // TODO
  // @ts-ignoree
  storage: customStorage(),
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
