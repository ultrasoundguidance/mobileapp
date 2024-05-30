import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { SkModernistTitleText } from './SkModernistTitleText'
import { UGTheme } from '../styles/Theme'

export default function LogoStatement() {
  const BlueText = () => {
    return (
      <SkModernistTitleText style={styles.blueText}>
        of your hand
      </SkModernistTitleText>
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
        <SkModernistTitleText>
          Ultrasound expertise in the palm {BlueText()}
        </SkModernistTitleText>
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
