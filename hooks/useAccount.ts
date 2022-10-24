import React from 'react'
import { createUserWithEmailAndPassword, getAuth, signInAnonymously, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import app from '../vendors/Firebase'
import { useNavigation } from '@react-navigation/native';


const useAccount = (email?: string, pw?: string) => {
    const [error, setError] = React.useState<string>();
    const nav = useNavigation();
    
    const auth = getAuth(app);
    const handleAnonSignIn = async () => {
      await signInAnonymously(auth);
    };

    const handleSignUp = async () => {
      if (!email) {
        setError("Please enter email");
        return;
      }
      if (!pw) {
        setError("Please enter password");
        return;
      }
      try {
          await createUserWithEmailAndPassword(auth, email, pw);
          nav.navigate("Root");
      } catch(err) {
        setError("Error creating account")     
    }
    };

    const handleSignIn = async () => {
      if (!email) {
        setError("Please enter email");
        return;
      }
      if (!pw) {
        setError("Please enter password");
        return;
      }
      try {
          await signInWithEmailAndPassword(auth, email, pw);
          nav.navigate("Root");
      } catch(err) {
        setError("Error signing in")
      }
    };

    const handleLogOut = async () => {
      await signOut(auth);
      nav.navigate("SignIn");
    };

    return {
        handleAnonSignIn, handleLogOut, handleSignIn, handleSignUp, error,
        auth,
    }
}

export default useAccount;