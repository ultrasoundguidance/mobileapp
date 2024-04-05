import { useFonts } from 'expo-font'
import React from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

import { UGTheme } from '../styles/Theme'

export const SkModernistTitleText = ({
  children,
  style,
}: React.PropsWithChildren<TextProps>) => {
  const [fontsLoaded] = useFonts({
    'Sk-Modernist-Regular': require('../../assets/fonts/Sk-Modernist-Regular.otf'),
    'Sk-Modernist-Bold': require('../../assets/fonts/Sk-Modernist-Bold.otf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <Text style={[{ color: UGTheme.colors.primary }, styles.text, style]}>
      {children}
    </Text>
  )
}
const styles = StyleSheet.create({
  text: {
    fontFamily: 'Sk-Modernist-Bold',
    fontSize: 30,
  },
})
