import 'react-native-gesture-handler'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from '../../App'
import HomeScreen from '../screens/Home'
import SampleVideosScreen from '../screens/SampleVideos'

const Stack = createStackNavigator<RootStackParamList>()

export default function HomeVideosNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SampleVideos"
        component={SampleVideosScreen}
        options={{
          headerBackTitleVisible: false,
          title: '',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}
