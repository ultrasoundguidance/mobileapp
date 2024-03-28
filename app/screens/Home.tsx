import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

import { RootStackParamList } from '../../App'

type HomeScreenProp = NativeStackScreenProps<RootStackParamList, 'Home'>

export default function HomeScreen({ navigation }: HomeScreenProp) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Videos')}>
        <Text>Go to Videos</Text>
      </TouchableOpacity>
    </View>
  )
}
