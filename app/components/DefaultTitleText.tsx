import React from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

import { UGTheme } from '../styles/Theme'

export const DefaultTitleText = ({
  children,
  style,
}: React.PropsWithChildren<TextProps>) => {
  return (
    <Text style={[{ color: UGTheme.colors.primary }, styles.text, style]}>
      {children}
    </Text>
  )
}
const styles = StyleSheet.create({
  text: {
    lineHeight: 30,
    fontWeight: 'bold',
    fontSize: 30,
  },
})
