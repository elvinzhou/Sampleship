import React, { createContext, useContext } from "react"
import useSWR from "swr"

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const { data, error, mutate } = useSWR(`/api/v1/auth/me`)
    const handleLogin = async googleData => {
        const res = await fetch("/api/v1/auth/google", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.tokenId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        console.log(data);
        if(data.error) throw new Error(data.error)
        mutate();
        this.props.history.push('/');
    }

    const logOut = async () => {
        await fetch("/api/v1/auth/logout", {
            method: "DELETE"
        })
        mutate()
    }

    return(
        <AuthContext.Provider value={{
            user: data,
            error: error,
            handleLogin: handleLogin,
            logOut: logOut
        }}> {children} </AuthContext.Provider>
    );
};

export const useAuthState = () => useContext(AuthContext);
