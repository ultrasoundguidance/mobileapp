import { StackScreenProps } from '@react-navigation/stack'
import axios from 'axios'
import * as Application from 'expo-application'
import * as Device from 'expo-device'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { RootStackParamList } from '../../App'
import { UG_URL } from '../Constants'
import LogoStatement from '../components/LogoStatement'
import PrimaryBtn from '../components/PrimaryBtn'
import { SkModernistText } from '../components/SkModernistText'
import { UGTheme } from '../styles/Theme'
import { MemberDetails } from '../types/Members'

type EmailScreenProp = StackScreenProps<RootStackParamList, 'Email'>

export default function EmailScreen({ navigation }: EmailScreenProp) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const sendEmailPasscode = async (
    email: string,
    name: string,
    membershipInfo: MemberDetails,
  ) => {
    axios
      .post(`${UG_URL}/auth/sendEmailPasscode`, {
        email: email.toLowerCase(),
        username: name,
      })
      .then(result => {
        console.log('sent email! 📫')
        navigation.navigate('Passcode', { email, membershipInfo })
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  async function setDeviceId(email: string) {
    let deviceId: string | null = ''
    if (Device.isDevice) {
      if (Device.brand === 'google') {
        deviceId = Application.getAndroidId()
      } else {
        deviceId = await Application.getIosIdForVendorAsync()
      }
    } else {
      deviceId = 'simulator'
    }

    try {
      await axios.post(`${UG_URL}/auth/mobileLogin`, {
        email: email.toLowerCase(),
        deviceId,
      })
    } catch (error) {
      console.log(error)
    }
    return deviceId
  }

  const validateMembership = async (email: string) => {
    let memberInfo = undefined
    try {
      const response = await axios.post(`${UG_URL}/auth/validateMembership`, {
        email: email.toLowerCase(),
      })

      if (response.data.length > 0) {
        memberInfo = response.data[0]
      } else {
        Alert.alert(
          'Email not found',
          'Enter the email address associated with your Ultrasound Guidance account',
        )
      }
    } catch (error) {
      console.log(error)
    }
    return memberInfo
  }

  const loginUser = async () => {
    setLoading(true)
    if (email === '') {
      Alert.alert('Enter email', 'Email cannot be blank')
    } else {
      const memberInfo = await validateMembership(email)
      if (memberInfo?.name) {
        const deviceId = await setDeviceId(email)
        memberInfo.deviceId = deviceId
        sendEmailPasscode(email, memberInfo.name, memberInfo)
      }
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
              <SkModernistText style={styles.header}>
                Enter your email
              </SkModernistText>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                placeholder="email@sample.com"
                onChangeText={(text: string) => {
                  setEmail(text)
                }}
                inputMode="email"
                value={email}
              />

              <PrimaryBtn text="Sign In" onPress={() => loginUser()} />
              <SkModernistText style={styles.header}>
                Don't have an account yet?
              </SkModernistText>
              <PrimaryBtn
                text="Create an account"
                btnStyle={{ backgroundColor: UGTheme.colors.primaryBlue }}
                textStyle={{ color: UGTheme.colors.primary }}
                onPress={() => navigation.navigate('NewUser')}
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
  input: {
    padding: 10,
    width: 'auto',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
})
