import React, { createContext, useContext } from "react"
import useSWR from "swr"

const AuthContext = createContext();

function AuthProvider (props) {

    const { data, error, mutate } = useSWR(`/api/v1/auth/me`)

    const googleLogIn = async googleData => {
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
        if(data.error) throw new Error(data.error)
        mutate()
        this.props.history.push('/')
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
            googleLogIn: googleLogIn,
            logOut: logOut
        }} {...props}/>
    )
}

function useAuthState() {
  const state = React.useContext(AuthContext)
  const isPending = state.status === 'pending'
  const isError = state.status === 'error'
  const isSuccess = state.status === 'success'
  const isAuthenticated = state.user && isSuccess
  return {
    ...state,
    isPending,
    isError,
    isSuccess,
    isAuthenticated,
  }
}

export {AuthProvider, useAuthState}
