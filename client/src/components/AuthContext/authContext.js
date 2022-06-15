import React, { createContext, useContext } from "react"
import useSWR from "swr"
import { googleLogout } from '@react-oauth/google';


const AuthContext = createContext();
const host = process.env.REACT_APP_HOST;

export const AuthProvider = ({children}) => {
    const fetcher = url => fetch(url,{method: "GET", credentials:'include'}).then(r => r.json())
    const { data, error, mutate } = useSWR(host + "/api/v1/auth/me", fetcher)
    console.log(data)
    const handleLogin = async googleData => {
        console.log(googleData)
        const res = await fetch(host + "/api/v1/auth/google", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.credential
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        console.log(data);
        if(data.error) throw new Error(data.error)
        mutate();
    }

    const logOut = async () => {
        await fetch(host + "/api/v1/auth/logout", {
            method: "DELETE"
        })
        googleLogout()
        mutate()
    }

    return(
        <AuthContext.Provider value={{
            user: data,
            error: error,
            handleLogin: handleLogin,
            logOut: logOut,
            mutate: mutate
        }}> {children} </AuthContext.Provider>
    );
};

export const useAuthState = () => useContext(AuthContext);
