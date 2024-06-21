import AsyncStorage from '@react-native-async-storage/async-storage'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import axios from 'axios'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import email from 'react-native-email'
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RootStackParamList } from '../../App'
import { UG_URL } from '../Constants'
import PrimaryBtn from '../components/PrimaryBtn'
import { SkModernistText } from '../components/SkModernistText'
import { SkModernistTitleText } from '../components/SkModernistTitleText'
import { useUserContext } from '../contexts/AppContext'
import { UGTheme } from '../styles/Theme'
import { Subscription } from '../types/Members'

type ProfileScreenProp = BottomTabScreenProps<RootStackParamList, 'Profile'>

export default function ProfileScreen({ navigation }: ProfileScreenProp) {
  const { userData, setUserData, setIsLoggedIn } = useUserContext()

  async function addPurchase() {
    try {
      axios.post(`${UG_URL}/auth/addSubscriptionToGhost`, {
        userEmail: userData?.email,
        userName: userData?.name,
        userId: userData?.stripeId,
      })
    } catch (error) {
      console.log(error)
    }

    userData!.subscriptions.push({
      tier: undefined,
      id: '',
      customer: undefined,
      plan: undefined,
      status: 'active',
      start_date: new Date().toISOString(),
      default_payment_card_last4: '',
      cancel_at_period_end: false,
      cancellation_reason: null,
      current_period_end: null,
      offer: null,
      price: {
        id: '',
        price_id: '',
        nickname: '',
        amount: 50,
        interval: '',
        type: '',
        currency: '',
        tier: {
          id: '',
          name: 'MSK Complete Package',
          tier_id: '',
        },
      },
    })
    userData!.status = 'active'
  }

  async function presentPaywall(): Promise<boolean> {
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall()

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
        return false
      case PAYWALL_RESULT.PURCHASED:
        await addPurchase()
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeVideos' }],
        })
        return true
      case PAYWALL_RESULT.RESTORED:
        return true
      default:
        return false
    }
  }

  const LogOut = async () => {
    setIsLoggedIn(false)
    setUserData(undefined)
    await AsyncStorage.removeItem('user_data')
  }

  type ItemProps = { subscription: Subscription }

  const handleEmail = () => {
    const to = ['team@ultrasoundguidance.com']
    email(to).catch(console.error)
  }

  const Item = ({ subscription }: ItemProps) => (
    <View>
      <View style={styles.infoContainer}>
        {userData ? (
          <View>
            <SkModernistTitleText style={{ fontSize: 15 }}>
              {subscription.price?.tier.name}
            </SkModernistTitleText>
            <SkModernistText>Status: {subscription.status}</SkModernistText>
            <SkModernistText>
              Start Date: {subscription.start_date.split('T')[0]}
            </SkModernistText>
          </View>
        ) : (
          <View />
        )}
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Image
          style={styles.image}
          contentFit="contain"
          source={require('../../assets/images/icon.png')}
        />
      </SafeAreaView>

      <View style={{ paddingBottom: 10 }}>
        <SkModernistText
          style={{ lineHeight: 25, fontSize: 25, fontWeight: 'bold' }}>
          {userData?.name}
        </SkModernistText>
        <SkModernistText>{userData?.email}</SkModernistText>
      </View>

      <View style={{ flex: 1 }}>
        <SkModernistText style={styles.subscriptions}>
          Subscriptions:
        </SkModernistText>
        {userData?.status !== 'free' ? (
          <FlatList
            data={userData?.subscriptions}
            renderItem={({ item }) => <Item subscription={item} />}
          />
        ) : (
          <View>
            <SkModernistText>
              You currently have a free membership, upgrade to a paid
              subscription for full access.
            </SkModernistText>
            <PrimaryBtn text="View plans" onPress={() => presentPaywall()} />
          </View>
        )}
        <View
          style={{
            marginHorizontal: 30,
          }}>
          <PrimaryBtn text="Log out" onPress={() => LogOut()} />
          <PrimaryBtn
            btnStyle={{ backgroundColor: UGTheme.colors.primaryBlue }}
            textStyle={{ color: UGTheme.colors.primary }}
            text="Contact support"
            onPress={() => handleEmail()}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  infoContainer: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  subscriptions: {
    lineHeight: 18,
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
})
