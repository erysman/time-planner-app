import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import {
  addAuthenticationHeaderInterceptor,
  removeInterceptor,
} from "../../../../config/axios-instance";
import { useInitializeUser } from "../../../clients/time-planner-server/client";
import {
  ErrorMessage,
  UserInfoDTO,
} from "../../../clients/time-planner-server/model";
import { useProtectRoutes } from "./UseProtectRoutes";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
});


function useAuthInterceptor(user: FirebaseAuthTypes.User | null) {
  const [interceptor, setInterceptor] = useState<number | null>(null);

  useEffect(() => {
    if (interceptor) {
      removeInterceptor(interceptor);
      setInterceptor(null);
    }
    if (!user) {
      return;
    }
    const newInterceptor = addAuthenticationHeaderInterceptor(
      async () => await user?.getIdToken()
    );
    setInterceptor(newInterceptor);
  }, [user]);
}

function useSetUserOnAuthStateChange(
  setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>,
  setLoggingInProgress: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    return auth().onAuthStateChanged(async (user) => {
      console.log(`auth state changed: ${user?.email}`);
      if (user) {
        // console.log(`token: ${await user.getIdToken()}`);
        setUser(user);
        setLoggingInProgress(false);
      } else {
        setUser(null);
        setLoggingInProgress(false);
      }
    });
  }, [auth, setUser]);
}

export interface IAuthContextActions {
  signUpWithPassword: (email: string, password: string) => Promise<void>;
  logInWithPassword: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const unsignedAuthContext: IAuthContext = {
  user: null,
  loggingInProgress: false,
  actions: getAuthContextActions(() => {}),
};


export interface IAuthContext {
  user: FirebaseAuthTypes.User | null;
  loggingInProgress: boolean;
  actions: IAuthContextActions;
}

export const AuthContext = createContext<IAuthContext>(unsignedAuthContext);

export const AuthProvider = (props: any) => {
  const [loggingInProgress, setLoggingInProgress] = useState(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  useSetUserOnAuthStateChange(setUser, setLoggingInProgress);
  useProtectRoutes(user);
  useAuthInterceptor(user);
  const initializeUser = useInitializeUser();
  const queryClient = useQueryClient();

  return (
    <AuthContext.Provider
      value={{
        user,
        loggingInProgress,
        actions: getAuthContextActions(setLoggingInProgress, initializeUser, () => queryClient.resetQueries()),
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("User's auth context doesn't exist!");
  }
  return context;
}

function getAuthContextActions(
  setLoggingInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  initializeUser?: UseMutationResult<UserInfoDTO, ErrorMessage, void, unknown>,
  resetCache?: () => void
): IAuthContextActions {
  const signUpWithPassword = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setLoggingInProgress(true);
      await auth().createUserWithEmailAndPassword(email, password);
      console.log("signed in with email and password");
      initializeUser?.mutate();
      if (!initializeUser?.isError) {
        console.log("user initialized");
      }
    } finally {
      setLoggingInProgress(false);
    }
  };

  const logInWithPassword = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setLoggingInProgress(true);
      await auth().signInWithEmailAndPassword(email, password);
      console.log("logged in with email and password");
    } finally {
      setLoggingInProgress(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoggingInProgress(true);
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const credentials = await auth().signInWithCredential(googleCredential);
      console.log(`is new user? :${credentials.additionalUserInfo?.isNewUser}`);
      if (credentials.additionalUserInfo?.isNewUser) {
        //initialize user account
        initializeUser?.mutate();
        if (!initializeUser?.isError) {
          console.log("user initialized");
          resetCache?.();
        }
      }
      console.log("Signed in with google account!");
    } finally {
      setLoggingInProgress(false);
    }
  };

  const logout = async () => {
    try {
      setLoggingInProgress(true);
      await auth().signOut();
      // GoogleSignin.revokeAccess()
      resetCache?.();
      console.log("Signed out!");
    } finally {
      setLoggingInProgress(false);
    }
  };

  return {
    signUpWithPassword,
    logInWithPassword,
    loginWithGoogle,
    logout,
  };
}
