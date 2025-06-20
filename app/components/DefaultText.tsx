import React from 'react'
import { Text, TextProps, StyleSheet } from 'react-native'

export const DefaultText = ({
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
  },
})
