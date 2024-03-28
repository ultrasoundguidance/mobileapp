import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'

import { useUserContext } from '../context/AppContext'

export interface Main {
  id: string
  uuid: string
  email: string
  name: string
  note: null
  geolocation: string
  subscribed: boolean
  created_at: Date
  updated_at: Date
  labels: Label[]
  subscriptions: Subscription[]
  avatar_image: string
  comped: boolean
  email_count: number
  email_opened_count: number
  email_open_rate: null
  status: string
  last_seen_at: Date
  email_suppression: EmailSuppression
  newsletters: Newsletter[]
}

export interface EmailSuppression {
  suppressed: boolean
  info: null
}

export interface Label {
  id: string
  name: string
  slug: string
  created_at: Date
  updated_at: Date
}

export interface Newsletter {
  id: string
  name: string
  description: string
  status: string
}

export interface Subscription {
  id: string
  tier: SubscriptionTier
  customer: Customer
  plan: Plan
  status: string
  start_date: Date
  default_payment_card_last4: string
  cancel_at_period_end: boolean
  cancellation_reason: null
  current_period_end: null
  price: Price
  offer: null
}

export interface Customer {
  id: string
  name: string
  email: string
}

export interface Plan {
  id: string
  nickname: string
  interval: string
  currency: string
  amount: number
}

export interface Price {
  id: string
  price_id: string
  nickname: string
  amount: number
  interval: string
  type: string
  currency: string
  tier: PriceTier
}

export interface PriceTier {
  id: string
  tier_id: string
}

export interface SubscriptionTier {
  id: string
  name: string
  slug: string
  monthly_price_id: string
  yearly_price_id: string
  description: string
  created_at: Date
  updated_at: Date
  type: string
  active: boolean
  welcome_page_url: string
  visibility: string
  trial_days: number
  monthly_price: number
  yearly_price: number
  currency: string
  expiry_at: null
}

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const { setIsLoggedIn } = useUserContext()

  const getUser = () => {
    if (email === '') {
      Alert.alert('Enter email', 'Email cannot be blank')
    } else {
      axios
        .post('http://127.0.0.1:3000/validate-email', {
          email: email.toLowerCase(),
        })
        .then(async response => {
          if (response.data.length > 0) {
            if (response.data[0].status === 'free') {
              Alert.alert(
                'No active subscription found',
                'To use the mobile app please subscribe at https://www.ultrasoundguidance.com/plans/',
              )
            } else if (
              response.data[0].status === 'paid' ||
              response.data[0].status === 'comped'
            ) {
              setIsLoggedIn(true)
              await AsyncStorage.setItem(
                'user_data',
                JSON.stringify(response.data[0]),
              )
            }
          } else {
            Alert.alert(
              'Email not found',
              'Enter the email address associated with your Ultrasound Guidance account',
            )
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <Text style={styles.header}>Enter your email</Text>
      <TextInput
        style={styles.input}
        placeholder="email@sample.com"
        onChangeText={(text: string) => {
          setEmail(text)
        }}
        value={email}
      />

      <TouchableOpacity style={styles.login_btn} onPress={() => getUser()}>
        <Text style={styles.btn_text}>Sign In</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  title: {
    fontSize: 30,
    marginBottom: 30,
  },
  header: {
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
  login_btn: {
    margin: 10,
    alignSelf: 'center',
    width: 170,
    padding: 10,
    backgroundColor: 'purple',
    borderRadius: 5,
  },
  btn_text: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
})
