import { NavigationContainer } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import VideosScreen from './Videos'

type RootStackParamList = {
  Home: undefined
  Videos: undefined
}

type HomeScreenProp = NativeStackScreenProps<RootStackParamList, 'Home'>

function HomeScreen({ navigation }: HomeScreenProp) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Videos')}>
        <Text>Go to Videos</Text>
      </TouchableOpacity>
    </View>
  )
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerBackTitleVisible: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Videos" component={VideosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
