import React from 'react'
import { Dimensions, SectionList, StyleSheet, View } from 'react-native'
import { Vimeo } from 'react-native-vimeo-iframe'

import { FreeSampleVideoIds } from '../Constants'
import { SkModernistTitleText } from '../components/SkModernistTitleText'

export default function SampleVideosScree() {
  const FreeVideoSections = [
    {
      title: 'Ultrasound Diagnostics',
      data: FreeSampleVideoIds.slice(4),
    },
    {
      title: 'Ultrasound Guided Procedures',
      data: FreeSampleVideoIds.slice(5, 7),
    },
  ]

  const Video = ({ videoId }: { videoId: number }) => {
    return (
      <Vimeo
        style={styles.videoContainer}
        videoId={`${videoId!}`}
        reference="https://www.ultrasoundguidance.com/"
      />
    )
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={FreeVideoSections}
        keyExtractor={item => item.toString()}
        renderItem={({ item }) => <Video videoId={item} />}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <SkModernistTitleText style={{ padding: 10, paddingTop: 10 }}>
            {title}
          </SkModernistTitleText>
        )}
      />
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
    marginVertical: 10,
  },
})
