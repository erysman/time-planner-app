import { router, useNavigation, useSegments } from "expo-router";
import { useEffect } from "react";
import {FirebaseAuthTypes} from "@react-native-firebase/auth";
import { Platform } from "react-native";
import { Href } from "expo-router/build/link/href";

function redirect(path: Href) {
    if (Platform.OS === "ios") {
        setTimeout(() => {
            router.replace(path);
        }, 1);
    } else {
        setImmediate(() => {
            router.replace(path);
        });
    }
}

export function useProtectRoutes(user: FirebaseAuthTypes.User|null) {
    const segments = useSegments();
    const navigation = useNavigation();

    useEffect(() => {
        const publicSegments = [
            "(auth)",
            undefined
        ];
        const inPublicSegment = publicSegments.some(s => s === segments[0]);

        if (!user && !inPublicSegment) {
            redirect("(auth)");
        }
        if (user && inPublicSegment) {
            console.log("resetting navigation history");
            navigation.reset({
                index: 0,
                routes: [{name: "(tabs)"}],
                history: []
            })
        }

    }, [segments, user]);
}