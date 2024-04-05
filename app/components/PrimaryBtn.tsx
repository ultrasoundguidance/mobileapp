import { useTheme } from '@react-navigation/native'
import React from 'react'
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'

import { UGTheme } from '../styles/Theme'

type PrimaryBtnProps = {
  text: string
  onPress: (event: GestureResponderEvent) => void
}
export default function PrimaryBtn(props: PrimaryBtnProps) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: colors.primary }]}
      onPress={props.onPress}>
      <Text style={{ color: UGTheme.colors.primaryBlue, fontWeight: 'bold' }}>
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
})
