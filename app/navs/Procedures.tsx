import 'react-native-gesture-handler'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from '../../App'
import VideoScreen from '../components/Video'
import VideosScreen from '../components/Videos'
import { AtlasTypes } from '../screens/Home'

const Stack = createStackNavigator<RootStackParamList>()

export default function ProceduresNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Videos"
        component={VideosScreen}
        options={{ headerShown: false }}
        initialParams={{ type: AtlasTypes.procedure }}
      />
      <Stack.Screen
        name="Video"
        component={VideoScreen}
        options={{
          headerBackTitleVisible: false,
          title: '',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}
