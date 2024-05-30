import 'react-native-gesture-handler'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from '../../App'
import EmailScreen from '../screens/Email'
import NewUserScreen from '../screens/NewUser'
import PasscodeScreen from '../screens/Passcode'

const Stack = createStackNavigator<RootStackParamList>()

export default function LoginNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Email"
        component={EmailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NewUser"
        component={NewUserScreen}
        options={{
          title: '',
          headerShadowVisible: false,
          headerTransparent: true,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Passcode"
        component={PasscodeScreen}
        options={{
          title: '',
          headerShadowVisible: false,
          headerTransparent: true,
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}
