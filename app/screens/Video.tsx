import { StackScreenProps } from '@react-navigation/stack'
import {
  Audio,
  InterruptionModeIOS,
  InterruptionModeAndroid,
  Video,
  ResizeMode,
} from 'expo-av'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { RootStackParamList } from '../../App'

type VideoScreenProps = StackScreenProps<RootStackParamList, 'Video'>

function VideoScreen({ route }: VideoScreenProps) {
  const video = useRef<Video>(null)
  const [loading, setLoading] = useState(true)
  const [uri, setUri] = useState<string>('')

  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
  })

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.vimeo.com/videos/${route.params.videoId}?fields=name,download`
      const response = await fetch(url, {
        headers: {
          Authorization: 'Bearer fdd1ac1f3a196210e29941eee7c3e6c5',
        },
      })

      const postData = await response.json()
      setUri(postData.download[0].link)
      setLoading(false)
    }
    fetchData().catch(console.error)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ textAlign: 'center', fontSize: 25, padding: 10 }}>
        {route.params.postTitle}
      </Text>
      <Text style={{ padding: 10 }}>{route.params.text}</Text>
      <View style={styles.videoContainer}>
        {loading ? (
          <Text>Loading</Text>
        ) : (
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            usePoster
            posterSource={{ uri: route.params.thumbNail }}
          />
        )}
      </View>
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
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
  },
})

export default VideoScreen
