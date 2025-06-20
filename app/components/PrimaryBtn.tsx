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

import { DefaultTitleText } from './DefaultTitleText'
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
      <DefaultTitleText
        style={[
          {
            fontSize: 15,
            fontWeight: 'bold',
            color: UGTheme.colors.primaryBlue,
          },
          props.textStyle,
        ]}>
        {props.text}
      </DefaultTitleText>
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
