import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useState, useEffect } from 'react'
import { Image, TouchableOpacity, View, Text } from 'react-native'

import { UserContext } from './app/context/AppContext'
import HomeScreen from './app/screens/Home'
import LoginScreen from './app/screens/Login'
import VideoScreen from './app/screens/Video'
import VideosScreen from './app/screens/Videos'

export type RootStackParamList = {
  Home: undefined
  Videos: { type: string }
  Video: {
    postTitle: string
    videoId: string
    text: string[]
    thumbNail: string
  }
  Login: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const getAuthenticated = async () => {
      try {
        const authenticated = await AsyncStorage.getItem('user_data')
        if (authenticated) {
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error(error)
      }
      setIsLoading(false)
    }
    getAuthenticated()
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={{ resizeMode: 'contain' }}
          source={require('./assets/app-splash.png')}
        />
      </View>
    )
  }

  const LogOut = async () => {
    setIsLoggedIn(false)
    await AsyncStorage.removeItem('user_data')
  }

  const LogOutBtn = () => {
    return (
      <TouchableOpacity onPress={() => LogOut()}>
        <Text>Log out</Text>
      </TouchableOpacity>
    )
  }
  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            headerTitleAlign: 'center', // for android
            headerTintColor: 'black',
          }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerRight: LogOutBtn }}
              />
              <Stack.Screen name="Videos" component={VideosScreen} />
              <Stack.Screen
                name="Video"
                component={VideoScreen}
                options={{
                  animationTypeForReplace: 'push',
                  headerShown: false,
                  gestureDirection: 'vertical',
                  orientation: 'all',
                }}
              />
            </>
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  )
}

export default App
