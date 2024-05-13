import 'react-native-gesture-handler'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { Image, View } from 'react-native'

import { MemberDetails, UserContext } from './app/contexts/AppContext'
import DiagnosticNav from './app/navs/Diagnostic'
import LoginNav from './app/navs/Login'
import ProceduresScreen from './app/navs/Procedures'
import HomeScreen, { AtlasTypes } from './app/screens/Home'
import ProfileScreen from './app/screens/Profile'
import { UGTheme } from './app/styles/Theme'
import { RootChild, WatchedVideo } from './app/types/Posts'

export type RootStackParamList = {
  Home: undefined
  Videos: { type: string }
  Video: {
    postId: string
    postTitle: string
    posts: [RootChild]
    thumbNail: string
    watchedVideos: [WatchedVideo]
  }
  Login: undefined
  Email: undefined
  Password: { email: string }
  Profile: undefined
  Diagnostic: undefined
  Procedures: undefined
}

const Tab = createBottomTabNavigator<RootStackParamList>()

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userData, setUserData] = useState<MemberDetails | undefined>(undefined)

  useEffect(() => {
    const getAuthenticated = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('user_data')
        if (userInfo) {
          const info: MemberDetails = JSON.parse(userInfo)
          setIsLoggedIn(true)
          setUserData(info)
        }
      } catch (error) {
        console.error(error)
      }
      setIsLoading(false)
    }
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
        {isLoggedIn ? (
          <Tab.Navigator
            id="RootNavigator"
            initialRouteName="Home"
            screenOptions={{
              tabBarInactiveTintColor: UGTheme.colors.secondaryBlue,
              headerShadowVisible: false,
              headerTitleAlign: 'center', // for android
              headerTintColor: 'black',
            }}>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 name="home" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Diagnostic"
              component={DiagnosticNav}
              options={{
                headerShown: false,
                title: AtlasTypes.diagnostic,
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="clipboard-pulse"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Procedures"
              component={ProceduresScreen}
              options={{
                headerShown: false,
                title: AtlasTypes.procedure,
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 name="procedures" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 name="user-alt" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        ) : (
          <LoginNav />
        )}
      </NavigationContainer>
    </UserContext.Provider>
  )
}

export default App
