import { useTheme } from '@react-navigation/native'
import React from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

import { SkModernistTitleText } from './SkModernistTitleText'
import { UGTheme } from '../styles/Theme'

type PrimaryBtnProps = {
  btnStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  text: string
  onPress: (event: GestureResponderEvent) => void
}
export default function PrimaryBtn(props: PrimaryBtnProps) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: colors.primary }, props.btnStyle]}
      onPress={props.onPress}>
      <SkModernistTitleText
        style={[
          {
            fontSize: 15,
            color: UGTheme.colors.primaryBlue,
          },
          props.textStyle,
        ]}>
        {props.text}
      </SkModernistTitleText>
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
