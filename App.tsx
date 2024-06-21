import 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Image, View, Platform } from 'react-native'
import Purchases from 'react-native-purchases'

import { UG_URL } from './app/Constants'
import { UserContext } from './app/contexts/AppContext'
import LoginNav from './app/navs/Login'
import MainNav from './app/navs/Main'
import { UGTheme } from './app/styles/Theme'
import { MemberDetails } from './app/types/Members'
import { RootChild, WatchedVideo } from './app/types/Posts'

export type RootStackParamList = {
  // Screens
  Posts: { type: string }
  Video: {
    postId: string
    postTitle: string
    posts: [RootChild]
    thumbNail: string
    watchedVideos: [{ [key: string]: WatchedVideo }]
    videoCount: number
  }
  Email: undefined
  Passcode: { email: string; membershipInfo: any }
  Profile: undefined
  NewUser: undefined
  Home: undefined
  SampleVideos: undefined

  // Navs
  HomeVideos: undefined
  Diagnostic: undefined
  Procedures: undefined
  Login: undefined
  Main: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userData, setUserData] = useState<MemberDetails | undefined>(undefined)

  const getUser = async (email: string) => {
    try {
      const result = await axios.post(`${UG_URL}/auth/validateMembership`, {
        email,
      })
      return result.data
    } catch (error) {
      console.error('Unable to get user: ', error)
    }
  }
  const getAuthenticated = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('user_data')
      if (userInfo) {
        const info: MemberDetails = JSON.parse(userInfo)
        const currentMember: MemberDetails[] = await getUser(info.email)
        if (currentMember.length === 1) {
          setUserData(currentMember[0])
          setIsLoggedIn(true)
        } else {
          if (info.status === 'free') {
            console.log('Setting Purchases information')
            if (Platform.OS === 'ios') {
              Purchases.configure({
                apiKey: 'appl_HUYMIRUuPfqAivWjKidHSJVXxvf',
                appUserID: info.stripeId,
              })
            } else if (Platform.OS === 'android') {
              Purchases.configure({ apiKey: '' })
            }
            Purchases.setAttributes({
              $email: info.email,
              $displayName: info.name,
            })
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getAuthenticated()
  }, [isLoggedIn])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={{ resizeMode: 'contain' }}
          source={require('./assets/images/icon.png')}
        />
      </View>
    )
  }

  return (
    <UserContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userData, setUserData }}>
      <NavigationContainer theme={UGTheme}>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Screen
              name="Main"
              component={MainNav}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginNav}
              options={{
                headerShown: false,
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  )
}

export default App
