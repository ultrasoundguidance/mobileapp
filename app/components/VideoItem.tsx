import { Video, ResizeMode } from 'expo-av'
import React, { useRef } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import { SkModernistText } from './SkModernistText'

const VideoItem = ({ uri, text }: { uri?: any; text?: string | undefined }) => {
  const video = useRef<Video>(new Video({}))

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
        onLoad={async () => {
          await video.current.playAsync()
          await video.current.pauseAsync()
          const value = await video.current.setRateAsync(0, true)
          console.log(value)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
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

export default VideoItem
