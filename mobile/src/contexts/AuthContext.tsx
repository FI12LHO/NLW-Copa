import { createContext, ReactNode, useEffect, useState } from "react";
import * as Auth from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Api } from "../Api/axios";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string,
    email: string,
    avatarUrl: string
}

export interface AuthContextDataProps {
    user: UserProps,
    isUserLoading: boolean,
    signIn: () => Promise<void>,
}

interface AuthContextProps {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }:AuthContextProps) {
    const [user, setUser] = useState<UserProps>({} as UserProps);
    const [isUserLoading, setIsUserLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        redirectUri: Auth.makeRedirectUri({ useProxy:true }),
        scopes: ["profile", "email"]
    });

    async function signIn() {
        try {
            setIsUserLoading(true);
            await promptAsync();

        } catch (error) {
            console.error(error);
            throw error;

        } finally {
            setIsUserLoading(false);
        }
    }

    async function signInWithGoogle(access_token:string) {
        try {
            setIsUserLoading(true);
            
            const token = await Api.post("/users", { access_token })
                .then(res =>res.data.token);

            Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            
            await Api.get("/me").then(res => setUser(res.data.user));

        } catch (error) {
            console.error(error);

        } finally {
            setIsUserLoading(false);
        }
    }

    useEffect(() => {
        if (response?.type == "success" && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken);
        }
    }, [ response ]);

    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user
        }}>
            { children }
        </AuthContext.Provider>
    )
}