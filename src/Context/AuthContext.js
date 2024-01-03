import { useContext, createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../Services/firebase.config';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    // signInWithPopup(auth, provider);
    signInWithPopup(auth, provider)
  };

  const logOut = () => {
      signOut(auth)
      setUser(null)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

       console.log("Current User",currentUser)
      
      if(currentUser?.email) {
        setUser({
          name: currentUser?.displayName ?? "" , 
          phoneNo: currentUser?.phoneNumber ?? "",
          email: currentUser?.email ?? "",
          profileUrl : currentUser?.photoURL ?? "",
          uid: currentUser?.uid ?? "",
          isAdmin : currentUser?.email?.includes('ragul') ? true : false
        });
      }

      else setUser(null)
    
      console.log('User', currentUser)
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
