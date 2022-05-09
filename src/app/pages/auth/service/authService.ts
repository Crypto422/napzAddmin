import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

import { auth, db } from "../../../../service/firebase";

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    let index = user.email?.indexOf("@");
    const q = query(collection(db, "Users"), where("UserID", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "Users"), {
        Username: user.email?.slice(0, index),
        UserID: user.uid,
        AvatarURL: '',
        Email: user.email,
        Name: user.displayName,
        Timezone: '',
        Currency: '',
        AuthProvider: "google",
      })
    }
  } catch (err: any) {
    // console.error(err);
    // alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};

export {
  signInWithGoogle,
  logout,
};
