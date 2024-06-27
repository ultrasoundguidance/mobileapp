import { openURL } from 'expo-linking'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { SkModernistText } from './SkModernistText'

export default function TermsConditions() {
  return (
    <View>
      <SkModernistText style={styles.terms}>
        By clicking “Sign Up” you agree to accept the{' '}
        <SkModernistText
          onPress={() =>
            openURL('https://www.ultrasoundguidance.com/terms-of-service/')
          }
          style={{ textDecorationLine: 'underline', color: 'blue' }}>
          terms and conditions
        </SkModernistText>{' '}
        and{' '}
        <SkModernistText
          onPress={() => openURL('https://www.ultrasoundguidance.com/privacy/')}
          style={{ textDecorationLine: 'underline', color: 'blue' }}>
          privacy policy
        </SkModernistText>
        .
      </SkModernistText>
    </View>
  )
}

const styles = StyleSheet.create({
  terms: {
    marginVertical: 20,
  },
})
