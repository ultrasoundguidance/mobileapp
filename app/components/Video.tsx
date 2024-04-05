import { StackScreenProps } from '@react-navigation/stack'
import {
  Audio,
  InterruptionModeIOS,
  InterruptionModeAndroid,
  ResizeMode,
  Video,
} from 'expo-av'
import React, { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { SkModernistText } from './SkModernistText'
import { SkModernistTitleText } from './SkModernistTitleText'
import { RootStackParamList } from '../../App'

type VideoScreenProps = StackScreenProps<RootStackParamList, 'Video'>
type VideoItemProps = { uri?: any; text?: string | undefined }

function VideoScreen({ navigation, route }: VideoScreenProps) {
  const video = useRef<Video>(new Video({}))
  const [loading, setLoading] = useState(true)
  const [postData, setPostData] = useState<VideoItemProps[]>()

  const getData = async () => {
    const postItems:
      | React.SetStateAction<[VideoItemProps] | undefined>
      | { uri?: any; text?: string }[] = []

    for (let index = 0; index < route.params.posts.length; index++) {
      if (route.params.posts[index].type === 'embed') {
        const url = `https://api.vimeo.com/videos/${route.params.posts[index].metadata?.video_id}?fields=name,download`
        const response = await fetch(url, {
          headers: {
            Authorization: 'Bearer fdd1ac1f3a196210e29941eee7c3e6c5',
          },
        })

        const uri = await response.json()
        postItems.push({ uri: uri.download[0].link })
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
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    })

    getData()
    setLoading(false)

    navigation.addListener('focus', () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } })
    })

    navigation.addListener('blur', () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'always' } })
    })
  }, [navigation])

  const VideoItem = ({ uri, text }: VideoItemProps) => {
    return text ? (
      <SkModernistText style={styles.text}>{text}</SkModernistText>
    ) : (
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          posterStyle={{ zIndex: -1 }}
          usePoster
          posterSource={{ uri: route.params.thumbNail }}
          onLoad={async () => {
            await video.current?.playAsync()
            await video.current?.pauseAsync()
          }}
        />
      </View>
    )
  }
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
            <VideoItem uri={item.uri} text={item.text} />
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
  videoContainer: {
    flex: 1,
  },
  text: {
    margin: 15,
    marginTop: 20,
    fontSize: 20,
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
  },
})

export default VideoScreen
