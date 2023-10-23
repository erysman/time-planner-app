import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { useProtectRoutes } from './UseProtectRoutes';
import { AXIOS_INSTANCE, addAuthenticationHeaderInterceptor, removeInterceptor } from '../../../../config/axios-instance';

GoogleSignin.configure({
    webClientId: process.env.PUBLIC_EXPO_GOOGLE_OAUTH_CLIENT_ID
});


export interface IAuthContext {
    user: FirebaseAuthTypes.User | null,
    loggingInProgress: boolean,
    actions: IAuthContextActions
}

export interface IAuthContextActions {
    signUpWithPassword: (email: string, password: string) => Promise<void>
    logInWithPassword: (email: string, password: string) => Promise<void>
    loginWithGoogle: () => Promise<void>,
    logout: () => Promise<void>,
}

const unsignedAuthContext: IAuthContext = {
    user: null,
    loggingInProgress: false,
    actions: getAuthContextActions(() => { }),
}

const AuthContext = createContext<IAuthContext>(unsignedAuthContext);

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
        const newInterceptor = addAuthenticationHeaderInterceptor(async () => await user?.getIdToken());
        setInterceptor(newInterceptor);
    }, [user])
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

export const AuthProvider = (props: any) => {
    const [loggingInProgress, setLoggingInProgress] = useState(false);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    useSetUserOnAuthStateChange(setUser, setLoggingInProgress);
    useProtectRoutes(user);
    useAuthInterceptor(user);

    return (
        <AuthContext.Provider value={{
            user,
            loggingInProgress,
            actions: getAuthContextActions(setLoggingInProgress)
        }}>
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

function getAuthContextActions(setLoggingInProgress: React.Dispatch<React.SetStateAction<boolean>>): IAuthContextActions {
    const signUpWithPassword = async (email: string, password: string): Promise<void> => {
        try {
            setLoggingInProgress(true);
            await auth().createUserWithEmailAndPassword(email, password);
            console.log("signed in with email and password")
        } finally {
            setLoggingInProgress(false);
        }
    };

    const logInWithPassword = async (email: string, password: string): Promise<void> => {
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
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            const credentials = await auth().signInWithCredential(googleCredential);
            console.log("Signed in with oauth!");
        } finally {
            setLoggingInProgress(false);
        }
    };

    const logout = async () => {
        try {
            setLoggingInProgress(true);
            await auth().signOut()
            console.log('Signed out!');
        } finally {
            setLoggingInProgress(false);
        }
    };

    return {
        signUpWithPassword,
        logInWithPassword,
        loginWithGoogle,
        logout
    };
}
