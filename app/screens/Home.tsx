import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

import { RootStackParamList } from '../../App'

type HomeScreenProp = StackScreenProps<RootStackParamList, 'Home'>

export enum AtlasTypes {
  diagnostic = 'Diagnostic Atlas',
  procedure = 'Procedure Atlas',
}

export default function HomeScreen({ navigation }: HomeScreenProp) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Welcome Username!</Text>
        <Text>Select which videos to view</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            navigation.navigate('Videos', { type: AtlasTypes.diagnostic })
          }>
          <Text>{AtlasTypes.diagnostic}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            navigation.navigate('Videos', { type: AtlasTypes.procedure })
          }>
          <Text>{AtlasTypes.procedure}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  contentContainer: {
    maxWidth: 250,
  },
  header: {
    fontSize: 30,
    marginVertical: 15,
  },
  btn: {
    padding: 10,
    alignItems: 'center',
    borderBlockColor: 'purple',
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 5,
  },
})
