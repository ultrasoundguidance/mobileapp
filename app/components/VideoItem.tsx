import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Vimeo } from 'react-native-vimeo-iframe'

import { DefaultText } from './DefaultText'
import PrimaryBtn from './PrimaryBtn'
import { UG_URL, FreeSampleVideoIds } from '../Constants'
import { useUserContext } from '../contexts/AppContext'

const VideoItem = ({
  postId,
  videoId,
  text,
  positionSecs,
  videoCount,
  presentPaywall,
}: {
  postId: string
  videoId?: number
  text?: string
  positionSecs: number | undefined
  videoCount: number
  presentPaywall: () => void
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
      videoCount,
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
    <DefaultText style={styles.text}>{text}</DefaultText>
  ) : (
    <View style={styles.container}>
      {userData?.status === 'free' ? (
        <View>
          {FreeSampleVideoIds.includes(videoId!) ? (
            <Vimeo
              style={styles.videoContainer}
              videoId={`${videoId!}`}
              reference="https://www.ultrasoundguidance.com/"
              params={`play_button_position=center&#t=${positionSecs}`}
              handlers={videoCallbacks}
            />
          ) : (
            <View
              style={[
                styles.videoContainer,
                {
                  backgroundColor: 'black',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <DefaultText
                style={[styles.text, { fontWeight: 'bold', color: 'white' }]}>
                This content is for subscribers only
              </DefaultText>
              <PrimaryBtn
                text="Subscribe now"
                onPress={() => presentPaywall()}
              />
            </View>
          )}
        </View>
      ) : (
        <Vimeo
          style={styles.videoContainer}
          videoId={`${videoId!}`}
          reference="https://www.ultrasoundguidance.com/"
          params={`play_button_position=center&#t=${positionSecs}`}
          handlers={videoCallbacks}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
  },
  text: {
    margin: 15,
    marginTop: 20,
    lineHeight: 20,
    fontSize: 20,
  },
})

export default VideoItem
