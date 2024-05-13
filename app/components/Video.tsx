import { StackScreenProps } from '@react-navigation/stack'
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av'
import React, { useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text } from 'react-native'

import { SkModernistTitleText } from './SkModernistTitleText'
import VideoItem from './VideoItem'
import { RootStackParamList } from '../../App'

type VideoScreenProps = StackScreenProps<RootStackParamList, 'Video'>
type VideoItemProps = {
  videoId?: number
  text?: string
  positionSecs?: number
}

function VideoScreen({ navigation, route }: VideoScreenProps) {
  const [loading, setLoading] = useState(true)
  const [postData, setPostData] = useState<VideoItemProps[]>()

  const getData = async () => {
    const postItems:
      | React.SetStateAction<[VideoItemProps] | undefined>
      | { videoId?: number; text?: string; positionSecs?: number }[] = []

    for (let index = 0; index < route.params.posts.length; index++) {
      if (route.params.posts[index].type === 'embed') {
        if (route.params.watchedVideos.length > 0) {
          route.params.watchedVideos.forEach(videos => {
            Object.values(videos).forEach(video => {
              if (
                video.videoId === route.params.posts[index].metadata?.video_id
              ) {
                postItems.push({
                  videoId: route.params.posts[index].metadata?.video_id,
                  positionSecs: video.watchedSeconds,
                })
              } else {
                postItems.push({
                  videoId: route.params.posts[index].metadata?.video_id,
                })
              }
            })
          })
        } else {
          postItems.push({
            videoId: route.params.posts[index].metadata?.video_id,
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
        style={{ textAlign: 'center', fontSize: 25, margin: 10 }}>
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
