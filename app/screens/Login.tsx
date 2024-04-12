import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Image } from 'expo-image'
import { openURL } from 'expo-linking'
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
import Dialog from 'react-native-dialog'
import { SafeAreaView } from 'react-native-safe-area-context'

import PrimaryBtn from '../components/PrimaryBtn'
import { SkModernistTitleText } from '../components/SkModernistTitleText'
import { useUserContext } from '../contexts/AppContext'
import { UGTheme } from '../styles/Theme'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showFreeMemberAlert, setShowFreeMemberAlert] = useState(false)
  const { setIsLoggedIn } = useUserContext()

  const handleDismiss = () => {
    setShowFreeMemberAlert(false)
  }

  const freeMemberAlert = () => {
    return (
      <View style={styles.freeMemberAlert}>
        <Dialog.Container visible={showFreeMemberAlert}>
          <Dialog.Title>No active subscription found</Dialog.Title>
          <Dialog.Description>
            To use the mobile app please subscribe at
          </Dialog.Description>
          <Dialog.Description
            onPress={() => openURL('https://www.ultrasoundguidance.com/plans/')}
            style={{ textDecorationLine: 'underline', color: 'blue' }}>
            www.ultrasoundguidance.com
          </Dialog.Description>
          <Dialog.Button label="OK" onPress={handleDismiss} />
        </Dialog.Container>
      </View>
    )
  }

  const getUser = () => {
    if (email === '') {
      Alert.alert('Enter email', 'Email cannot be blank')
    } else {
      setLoading(true)
      axios
        .post(
          'https://us-central1-ultrasound-guidance.cloudfunctions.net/app/validate-email',
          {
            email: email.toLowerCase(),
          },
        )
        .then(async response => {
          if (response.data.length > 0) {
            if (response.data[0].status === 'free') {
              setShowFreeMemberAlert(true)
            } else if (
              response.data[0].status === 'paid' ||
              response.data[0].status === 'comped'
            ) {
              await AsyncStorage.setItem(
                'user_data',
                JSON.stringify(response.data[0]),
              )
              setIsLoggedIn(true)
            }
          } else {
            Alert.alert(
              'Email not found',
              'Enter the email address associated with your Ultrasound Guidance account',
            )
          }
          setLoading(false)
        })
        .catch(error => {
          console.log(error)
        })
    }
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
              {freeMemberAlert()}
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
              <Text style={styles.header}>Enter your email</Text>
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

              <PrimaryBtn text="Sign In" onPress={() => getUser()} />
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
})
