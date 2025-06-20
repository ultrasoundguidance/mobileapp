import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { DefaultTitleText } from './DefaultTitleText'
import { UGTheme } from '../styles/Theme'

export default function LogoStatement() {
  const BlueText = () => {
    return (
      <DefaultTitleText style={styles.blueText}>
        of your hand
      </DefaultTitleText>
    )
  }

  return (
    <View>
      <Image
        style={styles.image}
        contentFit="contain"
        source={require('../../assets/images/icon.png')}
      />
      <View>
        <DefaultTitleText>
          Ultrasound expertise in the palm {BlueText()}
        </DefaultTitleText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  blueText: {
    color: UGTheme.colors.primaryBlue,
  },
})
