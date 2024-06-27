import React from 'react'
import { Text, TextProps, StyleSheet } from 'react-native'

export const SkModernistText = ({
  children,
  onPress,
  style,
}: React.PropsWithChildren<TextProps>) => {
  return (
    <Text onPress={onPress} style={[styles.text, style]}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    lineHeight: 20,
    fontFamily: 'Sk-Modernist-Regular',
  },
})
