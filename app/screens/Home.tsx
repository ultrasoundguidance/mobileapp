import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { Image } from 'expo-image'
import React from 'react'
import { View, StyleSheet } from 'react-native'

import { RootStackParamList } from '../../App'
import PrimaryBtn from '../components/PrimaryBtn'
import { SkModernistTitleText } from '../components/SkModernistTitleText'
import { useUserContext } from '../contexts/AppContext'

export enum AtlasTypes {
  diagnostic = 'Diagnostic Atlas',
  procedure = 'Procedure Atlas',
}

type HomeScreenProp = BottomTabScreenProps<RootStackParamList, 'Home'>

export default function HomeScreen({ navigation }: HomeScreenProp) {
  const { userData } = useUserContext()

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.image}
          contentFit="contain"
          source={require('../../assets/images/icon.png')}
        />
        <SkModernistTitleText style={styles.header}>
          Welcome, {userData?.name.split(' ')[0]}!
        </SkModernistTitleText>
        <PrimaryBtn
          text={AtlasTypes.diagnostic}
          onPress={() => {
            navigation.jumpTo('Diagnostic')
          }}
        />
        <PrimaryBtn
          text={AtlasTypes.procedure}
          onPress={() => {
            navigation.jumpTo('Procedures')
          }}
        />
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
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  header: {
    fontSize: 30,
    marginVertical: 15,
  },
})
