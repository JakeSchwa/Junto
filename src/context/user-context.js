import React from 'react';

const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

const userDefault = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  isLoggedIn: false
}

function userReducer(state, action) {
  switch (action.type) {
    case 'set': {
      const user = action.payload
      window.localStorage.setItem("user", JSON.stringify(user))
      return {user: user}
    }
    case 'reset': {
      window.localStorage.removeItem("user")
      return {user: userDefault}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function grabPersistedUser() {
  const persistedUser = window.localStorage.getItem("user") 
  return persistedUser ? JSON.parse(persistedUser) : userDefault;
}

function UserProvider({children}) {
  const [state, dispatch] = React.useReducer(
    userReducer, 
    {user: grabPersistedUser()}
  )

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

function useUserState() {
  const context = React.useContext(UserStateContext)
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider')
  }
  return context
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext)
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider')
  }
  return context
}

export {UserProvider, useUserState, useUserDispatch}