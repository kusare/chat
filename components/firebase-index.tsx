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
} from "firebase/firestore";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import React, { useState, useEffect } from "react";

// export type UserState = User | null;

// export const userState = atom<UserState>({
//   key: "userState", // unique ID (with respect to other atoms/selectors)
//   default: null, // default value (aka initial value)
// });

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
  timestamp: string;
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
    timestamp: "",
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
      timestamp: "",
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

  useEffect(() => {
    // Create the query to load the last 12 messages and listen for new ones.
    const recentMessagesQuery = query(
      collection(getFirestore(), "messages"),
      orderBy("timestamp", "desc"),
      limit(12)
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
export const ProfilePicUrl: React.FC = () => {
  const setProfilePicUrlState = useSetRecoilState(profilePicUrlState);
  const profilePicUrl = useRecoilValue(profilePicUrlState);
  const auth = getAuth(firebaseApp);
  onAuthStateChanged(auth, (user) => {
    const url: string = getProfilePicUrl();
    const addedUrl = "url(" + addSizeToGoogleProfilePic(url) + ")";
    setProfilePicUrlState(addedUrl);
  });
  return (
    <div
      style={{
        backgroundImage: profilePicUrl,
        width: "100px",
        height: "100px",
      }}
    ></div>
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
export const Msgs: React.FC = () => {
  const msgs = useMsgs();
  return (
    <>
      {msgs.map((msg, index) => (
        <div key={index}>{msg?.text.toString()}</div>
      ))}
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
