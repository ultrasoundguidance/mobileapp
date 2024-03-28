import { createContext, useContext } from 'react'

export type UserContent = {
  isLoggedIn: boolean
  setIsLoggedIn: (v: boolean) => void
}

export const UserContext = createContext<UserContent>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
})

export const useUserContext = () => useContext(UserContext)
