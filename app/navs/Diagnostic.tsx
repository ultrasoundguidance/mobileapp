import 'react-native-gesture-handler'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from '../../App'
import { AtlasTypes } from '../screens/Home'
import PostsScreen from '../screens/Posts'
import VideoScreen from '../screens/Video'

const Stack = createStackNavigator<RootStackParamList>()

export default function DiagnosticNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          headerShown: false,
        }}
        initialParams={{ type: AtlasTypes.diagnostic }}
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
