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
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { RootStackParamList } from '../../App'
import { UG_URL } from '../Constants'
import LogoStatement from '../components/LogoStatement'
import PrimaryBtn from '../components/PrimaryBtn'
import { SkModernistText } from '../components/SkModernistText'
import TermsConditions from '../components/TermsConditions'
import { UGTheme } from '../styles/Theme'
import { MemberDetails } from '../types/Members'

type NewUserScreenProp = StackScreenProps<RootStackParamList, 'NewUser'>

export default function NewUserScreen({ navigation }: NewUserScreenProp) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const validateMembership = async () => {
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

  const sendEmailPasscode = async (membershipInfo: MemberDetails) => {
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

  async function createMember() {
    await axios
      .post(`${UG_URL}/auth/createMember`, {
        name,
        email,
      })
      .catch(() => {
        Alert.alert(
          'Found account',
          'An account already exists with that email. Logging you into that account',
        )
      })
  }

  async function signUp() {
    if (email === '') {
      Alert.alert('Enter email', 'Email cannot be blank')
    } else if (name === '') {
      Alert.alert('Enter Name', 'Name cannot be blank')
    } else {
      setLoading(true)
      // Create Ghost member
      await createMember()
      // Get Ghost member
      const membershipInfo = await validateMembership()
      if (membershipInfo.name) {
        sendEmailPasscode(membershipInfo)
      }
      setLoading(false)
    }
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
              <SkModernistText style={styles.header}>Name</SkModernistText>
              <TextInput
                style={styles.input}
                placeholder="Jamie Larson"
                onChangeText={(text: string) => {
                  setName(text)
                }}
                value={name}
              />
              <SkModernistText style={styles.header}>Email</SkModernistText>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                placeholder="jamie@example.com"
                onChangeText={(text: string) => {
                  setEmail(text)
                }}
                inputMode="email"
                value={email}
              />
              <TermsConditions />
              <PrimaryBtn text="Sign Up" onPress={() => signUp()} />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
  },
  header: {
    marginTop: 15,
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
  },
})
