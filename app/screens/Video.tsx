import { StackScreenProps } from '@react-navigation/stack'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text } from 'react-native'
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui'

import { RootStackParamList } from '../../App'
import { UG_URL } from '../Constants'
import { SkModernistTitleText } from '../components/SkModernistTitleText'
import VideoItem from '../components/VideoItem'
import { useUserContext } from '../contexts/AppContext'

type VideoScreenProps = StackScreenProps<RootStackParamList, 'Video'>
type VideoItemProps = {
  videoId?: number
  text?: string
  positionSecs?: number
}

function VideoScreen({ navigation, route }: VideoScreenProps) {
  const { userData } = useUserContext()
  const [loading, setLoading] = useState(true)
  const [postData, setPostData] = useState<VideoItemProps[]>()

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

  const getData = async () => {
    const postItems:
      | React.SetStateAction<[VideoItemProps] | undefined>
      | { videoId?: number; text?: string; positionSecs?: number }[] = []

    for (let index = 0; index < route.params.posts.length; index++) {
      if (route.params.posts[index].type === 'embed') {
        const videoId = route.params.posts[index].metadata!.video_id
        if (route.params.watchedVideos.length > 0) {
          route.params.watchedVideos.forEach(videos => {
            if (videos[videoId]) {
              const videoItem = videos[videoId]
              postItems.push({
                videoId,
                positionSecs: videoItem.watchedSeconds,
              })
            } else {
              postItems.push({
                videoId,
              })
            }
          })
        } else {
          postItems.push({
            videoId,
          })
        }
      } else if (route.params.posts[index].type === 'paragraph') {
        route.params.posts[index].children?.forEach(element => {
          postItems.push({ text: element.text })
        })
      } else {
        console.error(
          `Unrecognized Post type: ${route.params.posts[index].type}. Allowed types are 'paragraph' and 'embed'`,
        )
      }
    }
    setPostData(postItems)
  }

  useEffect(() => {
    getData()
    setLoading(false)

    navigation.addListener('focus', () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } })
    })

    navigation.addListener('blur', () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'always' } })
    })
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <SkModernistTitleText
        style={{
          textAlign: 'center',
          lineHeight: 25,
          fontSize: 25,
          margin: 10,
        }}>
        {route.params.postTitle}
      </SkModernistTitleText>
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <FlatList
          data={postData}
          renderItem={({ item }) => (
            <VideoItem
              postId={route.params.postId}
              videoId={item.videoId}
              text={item.text}
              positionSecs={item.positionSecs}
              videoCount={route.params.videoCount}
              presentPaywall={presentPaywall}
            />
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})

export default VideoScreen
