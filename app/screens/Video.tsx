import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Video, ResizeMode } from 'expo-av'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { RootStackParamList } from '../../App'

type VideoScreenProps = NativeStackScreenProps<RootStackParamList, 'Video'>

function VideoScreen({ route }: VideoScreenProps) {
  const video = useRef(null)
  const [loading, setLoading] = useState(true)
  const [uri, setUri] = useState<string>('')

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

  return loading ? (
    <SafeAreaView style={{ alignItems: 'center' }}>
      <Text>Loading...</Text>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <Text style={{ textAlign: 'center', fontSize: 25, padding: 10 }}>
        {route.params.postTitle}
      </Text>
      <Text style={{ padding: 10 }}>{route.params.text}</Text>

      <View style={styles.videoContainer}>
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
          posterStyle={{ height: 210, width: 'auto' }}
          posterSource={{ uri: route.params.thumbNail }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  videoContainer: {
    flex: 1,
    padding: 10,
  },
  video: {
    width: 'auto',
    height: 210,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default VideoScreen
