import { getApps, getApp, initializeApp, FirebaseApp } from "firebase/app";
import { firebaseAppConfig } from "./firebase-config";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  Unsubscribe,
} from "firebase/auth";
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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { timeStamp } from "console";

export const profilePicUrlState = atom<string>({
  key: "profilePicUrState", // unique ID (with respect to other atoms/selectors)
  default: "/images/profile_placeholder.png", // default value (aka initial value)
});

export const userNameState = atom<string>({
  key: "userNameState", // unique ID (with respect to other atoms/selectors)
  default: "NO NAME", // default value (aka initial value)
});

export type Msg = {
  id: string;
  timestamp: Timestamp;
  name: string;
  text: string;
  profilePicUrl: string;
  imageUrl: string;
};
export type MsgState = Msg | null;
export const msgState = atom<MsgState>({
  key: "msgState",
  default: {
    id: "",
    timestamp: Timestamp.fromDate(new Date()),
    name: "",
    text: "",
    profilePicUrl: "",
    imageUrl: "",
  },
});
export const msgsState = atom<MsgState[]>({
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

/**
██╗███╗   ██╗██╗████████╗██╗ █████╗ ██╗     ██╗███████╗███████╗
██║████╗  ██║██║╚══██╔══╝██║██╔══██╗██║     ██║╚══███╔╝██╔════╝
██║██╔██╗ ██║██║   ██║   ██║███████║██║     ██║  ███╔╝ █████╗  
██║██║╚██╗██║██║   ██║   ██║██╔══██║██║     ██║ ███╔╝  ██╔══╝  
██║██║ ╚████║██║   ██║   ██║██║  ██║███████╗██║███████╗███████╗
 */

/**
 * dayjs.extend(relativeTime);
 */
dayjs.extend(relativeTime);

/**
 * Firebase Initialize
 */
export const firebaseApp: FirebaseApp = !getApps().length
  ? initializeApp(firebaseAppConfig)
  : getApp();

/**
 * Signs-in
 */
export async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

/**
 * Signs-out
 */
export function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}

/**
 ██████╗ ███████╗████████╗
██╔════╝ ██╔════╝╚══██╔══╝
██║  ███╗█████╗     ██║   
██║   ██║██╔══╝     ██║   
╚██████╔╝███████╗   ██║   
 ╚═════╝ ╚══════╝   ╚═╝   
 */

/**
 * Returns the signed-in user's profile Pic URL.
 */
const getProfilePicUrl = (): string => {
  const user = getAuth().currentUser;
  if (user === null || user.photoURL === null)
    return "/images/profile_placeholder.png";
  return user.photoURL;
};

/**
 *  Returns the signed-in user's display name.
 */
export const getUserName = (): string => {
  const user = getAuth().currentUser;
  if (user === null || user.displayName === null) return "";
  return user.displayName;
};

/**
 * Loads chat messages history and listens for upcoming ones.
 */
export const useMsgs = () => {
  const setMsgs = useSetRecoilState(msgsState);
  const msgs = useRecoilValue(msgsState);
  const LIMIT = 24;

  useEffect(() => {
    // Create the query to load the last 12 messages and listen for new ones.
    const recentMessagesQuery = query(
      collection(getFirestore(), "messages"),
      orderBy("timestamp", "desc"),
      limit(LIMIT)
    );
    // Start listening to the query.
    const unsub: Unsubscribe = onSnapshot(recentMessagesQuery, (snapshot) => {
      let addedMsgs: Msg[] = [];
      snapshot.docs.map((change) => {
        const message = change.data();
        addedMsgs.push({
          id: change.id,
          timestamp: message.timestamp,
          name: message.name,
          text: message.text,
          profilePicUrl: message.profilePicUrl,
          imageUrl: message.imageUrl,
        });
      }, []);
      setMsgs(addedMsgs);
      return unsub;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return msgs;
};

/**
██╗   ██╗████████╗██╗██╗     ██╗████████╗██╗   ██╗
██║   ██║╚══██╔══╝██║██║     ██║╚══██╔══╝╚██╗ ██╔╝
██║   ██║   ██║   ██║██║     ██║   ██║    ╚████╔╝ 
██║   ██║   ██║   ██║██║     ██║   ██║     ╚██╔╝  
╚██████╔╝   ██║   ██║███████╗██║   ██║      ██║   
 ╚═════╝    ╚═╝   ╚═╝╚══════╝╚═╝   ╚═╝      ╚═╝                                                
 */

/**
 * Adds a size to Google Profile pics URLs.
 */
function addSizeToGoogleProfilePic(url: string): string {
  if (
    url.toString().indexOf("googleusercontent.com") !== -1 &&
    url.toString().indexOf("?") === -1
  ) {
    return url + "?sz=150";
  }
  return url;
}

/**
 * Returns true if a user is signed-in.
 */
function isUserSignedIn() {
  return !!getAuth().currentUser;
}

/**
 ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗ ███╗   ██╗███████╗███╗   ██╗████████╗
██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗████╗  ██║██╔════╝████╗  ██║╚══██╔══╝
██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║██╔██╗ ██║█████╗  ██╔██╗ ██║   ██║   
██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║██║╚██╗██║██╔══╝  ██║╚██╗██║   ██║   
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝██║ ╚████║███████╗██║ ╚████║   ██║   
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═══╝   ╚═╝   
 */

/**
 * ProfilePicUrl
 */
export const ProfilePic: React.FC = () => {
  const setProfilePicUrlState = useSetRecoilState(profilePicUrlState);
  const profilePicUrl = useRecoilValue(profilePicUrlState);
  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (user) => {
    const url: string = getProfilePicUrl();
    const addedUrl = addSizeToGoogleProfilePic(url);
    setProfilePicUrlState(addedUrl);
  });
  return (
    <div>
      <Avatar alt="Remy Sharp" src={profilePicUrl} />
    </div>
  );
};

/**
 * Username
 */
export const UserName: React.FC = () => {
  const setUserNameState = useSetRecoilState(userNameState);
  const userName = useRecoilValue(userNameState);
  const auth = getAuth(firebaseApp);
  onAuthStateChanged(auth, (user) => {
    const name: string = getUserName();
    setUserNameState(name);
  });
  return <div>{userName.toString()}</div>;
};

/**
 * messages
 */
// export const Msgs: React.FC = () => {
//   const msgs = useMsgs();

//   return (
//     <>
//       {msgs.map((msg, index) => (
//         <>
//           {msg && (
//             <>
//               {msg?.timestamp && (
//                 <span key={index.toString() + "timestamp"}>
//                   {dayjs(msg?.timestamp?.seconds).format(
//                     "YYYY/MM/DD ddd HH:mm:ss"
//                   )}
//                 </span>
//               )}
//               {msg?.name && (
//                 <div key={index.toString() + "name"}>{msg?.name}</div>
//               )}
//               <ProfilePic key={index.toString() + "ProfilePic"}></ProfilePic>
//               <div key={index.toString() + "text"}>{msg?.text}</div>
//               {msg?.imageUrl && (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img
//                   src={msg?.imageUrl}
//                   alt="no image"
//                   key={index.toString() + "img"}
//                 />
//               )}
//             </>
//           )}
//         </>
//       ))}
//     </>
//   );
// };

/**
 * message
 */
export const Msg: React.FC<{ msg: MsgState }> = (props) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(
      dayjs(props.msg?.timestamp?.toDate()).format("YYYY/MM/DD ddd HH:mm:ss")
    );
  }, []);

  if (!props.msg) return <></>;

  return (
    <>
      {props.msg.timestamp && <time dateTime={time}>{time}</time>}
      {props.msg.name && <div>{props.msg.name}</div>}
      {props.msg.profilePicUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={props.msg.profilePicUrl} alt="profilePic" />
      )}
      <div>{props.msg.text}</div>
      {props.msg.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={props.msg.imageUrl} alt="no image" />
      )}
    </>
  );
};

/**
███████╗███████╗████████╗
██╔════╝██╔════╝╚══██╔══╝
███████╗█████╗     ██║   
╚════██║██╔══╝     ██║   
███████║███████╗   ██║   
╚══════╝╚══════╝   ╚═╝   
 */

// Saves a new message to Cloud Firestore.
export const setMsg = async (msgText: any) => {
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), "messages"), {
      name: getUserName(),
      text: msgText,
      profilePicUrl: getProfilePicUrl(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
};

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
export const setImgMsg = async (event: any) => {
  event.preventDefault();
  let file = event.target.files[0];

  let LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";
  try {
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    const messageRef = await addDoc(collection(getFirestore(), "messages"), {
      name: getUserName(),
      imageUrl: LOADING_IMAGE_URL,
      profilePicUrl: getProfilePicUrl(),
      timestamp: serverTimestamp(),
    });

    // 2 - Upload the image to Cloud Storage.
    const filePath = `${getAuth().currentUser?.uid}/${messageRef.id}/${
      file.name
    }`;
    const newImageRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);

    // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);

    // 4 - Update the chat message placeholder with the image's URL.
    await updateDoc(messageRef, {
      imageUrl: publicImageUrl,
      storageUri: fileSnapshot.metadata.fullPath,
    });
  } catch (error) {
    console.error(
      "There was an error uploading a file to Cloud Storage:",
      error
    );
  }
};
