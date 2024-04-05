import { useFonts } from 'expo-font'
import React from 'react'
import { Text, TextProps, StyleSheet } from 'react-native'

export const SkModernistText = ({
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

  return <Text style={[styles.text, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Sk-Modernist-Regular',
  },
})
