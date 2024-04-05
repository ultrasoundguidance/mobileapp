import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import PrimaryBtn from '../components/PrimaryBtn'
import { SkModernistText } from '../components/SkModernistText'
import { SkModernistTitleText } from '../components/SkModernistTitleText'
import { useUserContext, Subscription } from '../contexts/AppContext'

export default function ProfileScreen() {
  const { userData, setUserData, setIsLoggedIn } = useUserContext()

  const LogOut = async () => {
    setIsLoggedIn(false)
    setUserData(undefined)
    await AsyncStorage.removeItem('user_data')
  }

  type ItemProps = { subscription: Subscription }

  const Item = ({ subscription }: ItemProps) => (
    <View>
      <View style={styles.InfoContainer}>
        <SkModernistTitleText style={{ fontSize: 15 }}>
          {subscription.tier.name}
        </SkModernistTitleText>
        <SkModernistText>Statue: {subscription.status}</SkModernistText>
        <SkModernistText>
          Start Date: {subscription.start_date.split('T')[0]}
        </SkModernistText>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{ width: 150, height: 150, alignSelf: 'center' }}
        contentFit="contain"
        source={require('../../assets/images/icon.png')}
      />
      <View style={{ paddingBottom: 10 }}>
        <SkModernistText style={{ fontSize: 25, fontWeight: 'bold' }}>
          {userData?.name}
        </SkModernistText>
        <SkModernistText>{userData?.email}</SkModernistText>
      </View>

      <View>
        <SkModernistText
          style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 5 }}>
          Subscriptions:
        </SkModernistText>
        <FlatList
          data={userData?.subscriptions}
          renderItem={({ item }) => <Item subscription={item} />}
        />
      </View>
      <View style={{ flex: 1, margin: 30 }}>
        <PrimaryBtn text="Log out" onPress={() => LogOut()} />
      </View>
    </SafeAreaView>
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
  InfoContainer: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
})
