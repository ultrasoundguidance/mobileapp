import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Video, ResizeMode } from 'expo-av'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { RootStackParamList } from '../../App'

type VideoScreenProps = NativeStackScreenProps<RootStackParamList, 'Video'>

interface VideoDataProps {
  name: string
  download: []
}
function VideoScreen({ route }: VideoScreenProps) {
  const video = useRef(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<VideoDataProps>()
  const [uri, setUri] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.vimeo.com/videos/811420003?fields=name,download`
      const response = await fetch(url, {
        headers: {
          Authorization: 'Bearer fdd1ac1f3a196210e29941eee7c3e6c5',
        },
      })

      const postData = await response.json()
      setUri(postData.download[0].link)
      setData(postData)
      setLoading(false)
    }
    fetchData().catch(console.error)
  }, [])

  return loading ? (
    <Text style={{ textAlign: 'center' }}>Loading...</Text>
  ) : (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center', fontSize: 25, padding: 10 }}>
        {data!.name}
      </Text>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default VideoScreen
