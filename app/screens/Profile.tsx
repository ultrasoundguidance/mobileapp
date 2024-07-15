import AsyncStorage from '@react-native-async-storage/async-storage'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import axios from 'axios'
import { Image } from 'expo-image'
import { openURL } from 'expo-linking'
import React from 'react'
import { StyleSheet, View, FlatList, Alert } from 'react-native'
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

  const logOut = async () => {
    setIsLoggedIn(false)
    setUserData(undefined)
    await AsyncStorage.removeItem('user_data')
  }

  type ItemProps = { subscription: Subscription }

  const handleEmail = () => {
    const to = ['team@ultrasoundguidance.com']
    email(to, { checkCanOpen: false }).catch(console.error)
  }

  const deleteAccount = () => {
    try {
      axios.post(`${UG_URL}/auth/deleteMember`, {
        id: userData?.id,
      })
      logOut()
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Unable to delete account',
        'Please contact support for further assistance',
      )
    }
  }

  const confirmDeleteAlert = () =>
    Alert.alert(
      'Delete Account',
      'Deleting your account will remove all data. Are you sure you want to delete your account?',
      [
        {
          text: 'Delete Account',
          onPress: () => deleteAccount(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    )

  const Item = ({ subscription }: ItemProps) => (
    <View>
      <View style={styles.infoContainer}>
        {userData ? (
          <View>
            <SkModernistTitleText style={{ fontSize: 15 }}>
              {subscription.tier?.name
                ? subscription.tier?.name
                : subscription.price?.tier.name}
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
          <View style={styles.infoContainer}>
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
          <PrimaryBtn text="Log out" onPress={() => logOut()} />
          <PrimaryBtn
            btnStyle={{ backgroundColor: UGTheme.colors.primaryBlue }}
            textStyle={{ color: UGTheme.colors.primary }}
            text="Contact support"
            onPress={() => handleEmail()}
          />
          <PrimaryBtn
            btnStyle={{ backgroundColor: 'red' }}
            textStyle={{ color: 'white' }}
            text="Delete Account"
            onPress={() => confirmDeleteAlert()}
          />
        </View>
        <View>
          <SkModernistText style={styles.aboutUs}>
            Learn more about the physicians who created this content{' '}
            <SkModernistText
              onPress={() =>
                openURL('https://www.ultrasoundguidance.com/about/')
              }
              style={{ textDecorationLine: 'underline', color: 'blue' }}>
              here
            </SkModernistText>
            .
          </SkModernistText>
          <SkModernistText style={styles.termsAndPrivacy}>
            View the{' '}
            <SkModernistText
              onPress={() =>
                openURL('https://www.ultrasoundguidance.com/terms-of-service/')
              }
              style={{ textDecorationLine: 'underline', color: 'blue' }}>
              Terms and Conditions
            </SkModernistText>{' '}
            and{' '}
            <SkModernistText
              onPress={() =>
                openURL('https://www.ultrasoundguidance.com/privacy/')
              }
              style={{ textDecorationLine: 'underline', color: 'blue' }}>
              Privacy Policy
            </SkModernistText>
          </SkModernistText>
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
  aboutUs: {
    marginTop: 20,
  },
  termsAndPrivacy: {
    marginVertical: 10,
  },
})
