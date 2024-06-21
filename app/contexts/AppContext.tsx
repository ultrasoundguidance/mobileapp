import { createContext, useContext } from 'react'

import { MemberDetails } from '../types/Members'

export type UserContent = {
  isLoggedIn: boolean
  setIsLoggedIn: (v: boolean) => void
  userData: MemberDetails | undefined
  setUserData: (v: MemberDetails | undefined) => void
}

export const UserContext = createContext<UserContent>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userData: undefined,
  setUserData: () => {},
})

export const useUserContext = () => useContext(UserContext)
