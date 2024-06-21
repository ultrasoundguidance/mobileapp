import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'

import DiagnosticNav from './Diagnostic'
import HomeVideosNav from './HomeVideos'
import ProceduresNav from './Procedures'
import { RootStackParamList } from '../../App'
import { AtlasTypes } from '../screens/Home'
import ProfileScreen from '../screens/Profile'
import { UGTheme } from '../styles/Theme'

const Tab = createBottomTabNavigator<RootStackParamList>()

export default function MainNav() {
  return (
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
        name="HomeVideos"
        component={HomeVideosNav}
        options={{
          title: 'Home',
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
        component={ProceduresNav}
        options={{
          headerShown: false,
          title: AtlasTypes.procedure,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="needle" size={size} color={color} />
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
  )
}
