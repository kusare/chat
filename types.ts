import { Timestamp } from "firebase/firestore";

/**
███╗   ███╗███████╗ ██████╗ 
████╗ ████║██╔════╝██╔════╝ 
██╔████╔██║███████╗██║  ███╗
██║╚██╔╝██║╚════██║██║   ██║
██║ ╚═╝ ██║███████║╚██████╔╝
╚═╝     ╚═╝╚══════╝ ╚═════╝ 
                            
 */

//TODO delete msg type
// export type Msg = {
// id: string;
// date: Date;
// name: string;
// text?: string;
// chatTxt: string;
// title: string;
// profilePicUrl: string;
// imageUrl: string;
// };

// export type MsgState = Msg | null;

export type ChatMsg = {
  id: string;
  date: Date;
  name: string;
  text?: string;
  chatTxt: string;
  title: string;
  profilePicUrl: string;
  imageUrl: string;
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

export type CssMsgArg = {
  cssBackground: string;
  cssTopbar: string;
  cssTopbarDeco: string;
  cssChatMsg: string;
  cssChatMsgDeco: string;
  cssSubChatMsg: string;
  cssChatMsgTitleDeco: string;
};

export type CssMsg = {
  id?: string;
  timestamp: any;
  name: string;
  profilePicUrl: string;
  imageUrl?: string;
} & CssMsgArg;

export type CssMsgState = CssMsg | null;

/**
██╗██████╗ 
██║██╔══██╗
██║██║  ██║
██║██║  ██║
██║██████╔╝
╚═╝╚═════╝ 
           
 */

//TODO Rename TypeThemeUiTargetId
export type ThemeUiTargetId =
  | "cssBackground"
  | "cssTopbar"
  | "cssTopbarDeco"
  | "cssChatMsg"
  | "cssChatMsgDeco"
  | "cssSubChatMsg"
  | "cssChatMsgTitleDeco";

/**
██████╗  █████╗ ██████╗ ██╗ ██████╗     ██████╗ ████████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗██║██╔═══██╗    ██╔══██╗╚══██╔══╝████╗  ██║
██████╔╝███████║██║  ██║██║██║   ██║    ██████╔╝   ██║   ██╔██╗ ██║
██╔══██╗██╔══██║██║  ██║██║██║   ██║    ██╔══██╗   ██║   ██║╚██╗██║
██║  ██║██║  ██║██████╔╝██║╚██████╔╝    ██████╔╝   ██║   ██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝ ╚═════╝     ╚═════╝    ╚═╝   ╚═╝  ╚═══╝
                                                                   
 */

export type ChatRadioBtnId = "Normal" | "Recipe";

/**
██████╗ ██╗   ██╗██╗██╗     ██████╗ ███████╗██████╗ 
██╔══██╗██║   ██║██║██║     ██╔══██╗██╔════╝██╔══██╗
██████╔╝██║   ██║██║██║     ██║  ██║█████╗  ██████╔╝
██╔══██╗██║   ██║██║██║     ██║  ██║██╔══╝  ██╔══██╗
██████╔╝╚██████╔╝██║███████╗██████╔╝███████╗██║  ██║
╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝
                                                    
 */

export type Member = {
  id: string;
  name: string;
  avatarSrc: string;
  role?: string;
  bio?: string;
  sources?: string[];
  includeUrlRegex?: string;
  excludeUrlRegex?: string;
  githubUsername?: string;
  twitterUsername?: string;
  websiteUrl?: string;
};

export type PostItem = {
  authorId: string;
  authorName: string;
  title: string;
  link: string;
  contentSnippet?: string;
  isoDate?: string;
  dateMiliSeconds: number;
};
