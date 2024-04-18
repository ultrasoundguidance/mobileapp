import axios from 'axios'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'

import { UG_URL } from '../Constants'
import PrimaryBtn from '../components/PrimaryBtn'
import { SkModernistText } from '../components/SkModernistText'
import { SkModernistTitleText } from '../components/SkModernistTitleText'
import { useUserContext } from '../contexts/AppContext'
import { UGTheme } from '../styles/Theme'

const CELL_COUNT = 6

export default function PasswordScreen() {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')
  const { setIsLoggedIn } = useUserContext()
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  const verifyEmailPassword = () => {
    setLoading(true)
    axios
      .post(`${UG_URL}/auth/verifyEmailPasscode`, {
        email: 'vnikki13@gmail.com',
        passcode: value,
      })
      .then(result => {
        setIsLoggedIn(true)
      })
      .catch(error => {
        if (error.response) {
          if (error.response.data === 'Unauthorized') {
            Alert.alert('Unauthorized')
          }
        }
      })
    setLoading(false)
  }

  const BlueText = () => {
    return (
      <SkModernistTitleText style={styles.blueText}>
        of your hand
      </SkModernistTitleText>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View>
          <ActivityIndicator size="large" color={UGTheme.colors.primary} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Image
                style={styles.image}
                contentFit="contain"
                source={require('../../assets/images/icon.png')}
              />
              <View>
                <SkModernistTitleText>
                  Ultrasound expertise in the palm {BlueText()}
                </SkModernistTitleText>
              </View>
              <Text style={styles.header}>
                Enter the verification code we sent to your email.
              </Text>
              <CodeField
                rootStyle={{ paddingBottom: 20 }}
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    onLayout={getCellOnLayoutHandler(index)}
                    key={index}
                    style={[styles.cellRoot, isFocused && styles.focusCell]}>
                    <SkModernistText style={styles.cellText}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </SkModernistText>
                  </View>
                )}
              />
              <PrimaryBtn
                text="Validate"
                onPress={() => verifyEmailPassword()}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  freeMemberAlert: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    alignItems: 'center',
  },
  header: {
    marginTop: 30,
    marginBottom: 5,
    fontSize: 20,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  blueText: {
    color: UGTheme.colors.primaryBlue,
  },
  input: {
    padding: 10,
    width: 'auto',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  cellRoot: {
    width: 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: UGTheme.colors.primary,
    borderBottomWidth: 2,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: UGTheme.colors.primaryBlue,
    borderBottomWidth: 2,
  },
})
