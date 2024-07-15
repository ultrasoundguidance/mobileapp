import 'react-native-gesture-handler'
import Octicons from '@expo/vector-icons/Octicons'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from '../../App'
import { AtlasTypes } from '../screens/Home'
import PostsScreen from '../screens/Posts'
import VideoScreen from '../screens/Video'
import { UGTheme } from '../styles/Theme'

const Stack = createStackNavigator<RootStackParamList>()

const BackIcon = (props: any) => {
  return (
    <Octicons
      name="chevron-left"
      size={30}
      color={UGTheme.colors.primary}
      style={{ padding: 10 }}
    />
  )
}

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
          headerBackImage: () => <BackIcon />,
        }}
      />
    </Stack.Navigator>
  )
}
