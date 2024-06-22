import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackScreenProps } from '@react-navigation/stack'
import axios from 'axios'
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

import { RootStackParamList } from '../../App'
import { UG_URL } from '../Constants'
import LogoStatement from '../components/LogoStatement'
import PrimaryBtn from '../components/PrimaryBtn'
import { SkModernistText } from '../components/SkModernistText'
import { useUserContext } from '../contexts/AppContext'
import { UGTheme } from '../styles/Theme'

const CELL_COUNT = 6

type PasscodeScreenProps = StackScreenProps<RootStackParamList, 'Passcode'>

export default function PasscodeScreen({ route }: PasscodeScreenProps) {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')
  const { setIsLoggedIn, setUserData } = useUserContext()
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify(route.params.membershipInfo)
      await AsyncStorage.setItem('user_data', jsonValue)
      setUserData(route.params.membershipInfo)
    } catch (e) {
      console.error('Something went wrong saving user data: ', e)
    }
  }

  const verifyEmailPasscode = async (): Promise<boolean> => {
    try {
      await axios.post(`${UG_URL}/auth/verifyEmailPasscode`, {
        email: route.params.email,
        passcode: value,
      })
      return true
    } catch (error) {
      console.log('Passcode not valid', error)
      return false
    }
  }

  const validate = async () => {
    setLoading(true)
    if (await verifyEmailPasscode()) {
      await storeData()
      setIsLoggedIn(true)
    } else {
      Alert.alert('Unauthorized', 'Incorrect Passcode')
    }
    setLoading(false)
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
              <LogoStatement />
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
              <PrimaryBtn text="Validate" onPress={() => validate()} />
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
    lineHeight: 36,
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: UGTheme.colors.primaryBlue,
    borderBottomWidth: 2,
  },
})
