import { openURL } from 'expo-linking'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { DefaultText } from './DefaultText'

export default function TermsConditions() {
  return (
    <View>
      <DefaultText style={styles.terms}>
        By clicking “Sign Up” you agree to accept the{' '}
        <DefaultText
          onPress={() =>
            openURL('https://www.ultrasoundguidance.com/terms-of-service/')
          }
          style={{ textDecorationLine: 'underline', color: 'blue' }}>
          terms and conditions
        </DefaultText>{' '}
        and{' '}
        <DefaultText
          onPress={() => openURL('https://www.ultrasoundguidance.com/privacy/')}
          style={{ textDecorationLine: 'underline', color: 'blue' }}>
          privacy policy
        </DefaultText>
        .
      </DefaultText>
    </View>
  )
}

const styles = StyleSheet.create({
  terms: {
    marginVertical: 20,
  },
})
