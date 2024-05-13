import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Vimeo } from 'react-native-vimeo-iframe'

import { SkModernistText } from './SkModernistText'
import { UG_URL } from '../Constants'
import { useUserContext } from '../contexts/AppContext'

const VideoItem = ({
  postId,
  videoId,
  text,
  positionSecs,
}: {
  postId: string
  videoId?: number
  text?: string
  positionSecs: number | undefined
}) => {
  const { userData } = useUserContext()
  const [currentTime, setCurrentTime] = useState<number>()
  const [duration, setDuration] = useState<number>()

  useEffect(() => {
    if (videoId) {
      axios
        .get(
          `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`,
          {
            headers: {
              Referer: 'https://www.ultrasoundguidance.com/',
            },
          },
        )
        .then(response => {
          setDuration(response.data.duration)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [])

  const saveVideoProgress = (progressPosition: number) => {
    axios.post(`${UG_URL}/video/saveVideoProgress`, {
      email: userData?.email,
      postId,
      progressPosition,
      videoId,
      watchedSeconds: currentTime,
    })
  }

  const videoCallbacks = {
    timeupdate: (data: any) => {
      setCurrentTime(data['currentTime'])
    },
    pause: (data: any) => {
      if (duration && currentTime) {
        saveVideoProgress(currentTime / duration)
      }
    },
    ended: (data: any) => {
      if (duration && currentTime) {
        saveVideoProgress(currentTime / duration)
      }
    },
  }
  return text ? (
    <SkModernistText style={styles.text}>{text}</SkModernistText>
  ) : (
    <View style={styles.videoContainer}>
      <Vimeo
        style={{
          width: Dimensions.get('screen').width,
          height: Dimensions.get('window').width * (9 / 16),
        }}
        videoId={`${videoId!}`}
        reference="https://www.ultrasoundguidance.com/"
        params={`play_button_position=center&#t=${positionSecs}`}
        handlers={videoCallbacks}
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
