import React, { useContext, createContext, useState, useEffect } from "react"
import { auth, db } from "../../service/firebase"
import { query, collection, onSnapshot, where } from 'firebase/firestore';

const Context = createContext<any>({})

export function useAuth() {
  return useContext(Context)
}

export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState<any>()
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const fetchUserData = (user: any) => {
    try {
      const q = query(collection(db, "Users"), where("Email", "==", user?.email));
      onSnapshot(q, (querySnapshot) => {
        let newUsers: any = [];
        querySnapshot.forEach((doc) => {
          newUsers.push({ ...doc.data(), id: doc.id });
        });
        if (newUsers.length === 0) {
          setUserData(null);
        } else {
          setUserData(newUsers[0]);
        }
      });
    } catch (err) {
      console.log('Fail fetch userData', err)
    }
  };

  

  const UserReload = async () => {
    await currentUser.reload()
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user)
      if (user?.uid.length > 0) {
        fetchUserData(user);
      }
      setLoading(false)
      return unsubscribe
    })
  }

  useEffect(() => {
    if (process.env.REACT_APP_ENV === "dev") {
      const unsubscribe = auth.onAuthStateChanged((user: any) => {
        setCurrentUser(user)
        if (user?.uid.length > 0) {
          fetchUserData(user);
        }
        setLoading(false)
      })
      return unsubscribe
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    userData,
    currentUser,
    UserReload,
  }
  return (
    <Context.Provider value={value}>
      {!loading && children}
    </Context.Provider>
  )
}
