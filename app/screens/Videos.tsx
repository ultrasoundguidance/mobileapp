import { NativeStackScreenProps } from '@react-navigation/native-stack'
import axios from 'axios'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import {
  SectionList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { MultipleSelectList } from 'react-native-dropdown-select-list'

import { AtlasTypes } from './Home'
import { RootStackParamList } from '../../App'

interface VideoProps {
  value: string
  label: string
  data: [PostData]
}

interface PostData {
  id: string
  title: string
  videoId: string
  text: []
  thumbNail: string
  tag: Tag
}

interface Tag {
  id: string
  name: string
  slug: string
  description: null
  feature_image: null
  visibility: PrimaryTagVisibility
  og_image: null
  og_title: null
  og_description: null
  twitter_image: null
  twitter_title: null
  twitter_description: null
  meta_title: null
  meta_description: null
  codeinjection_head: null
  codeinjection_foot: null
  canonical_url: null
  accent_color: null
  url: string
}

enum PrimaryTagVisibility {
  Internal = 'internal',
  Public = 'public',
}
type VideosScreenProps = NativeStackScreenProps<RootStackParamList, 'Videos'>

function VideosScreen({ navigation, route }: VideosScreenProps) {
  const [data, setData] = useState<VideoProps[]>()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    navigation.setOptions({ headerTitle: route.params.type })
    const tag =
      route.params.type === AtlasTypes.diagnostic ? 'msk' : 'hash-procedure'
    axios
      .post(
        'https://us-central1-ultrasound-guidance.cloudfunctions.net/app/get-published-posts',
        {
          tag,
        },
      )
      .then(response => {
        const videoData: VideoProps[] = Object.values(
          response.data.reduce((accumulator: any, post: any) => {
            let videoId = ''
            const sections: (string | any[])[] = []

            if (post.mobiledoc) {
              const mobiledoc = JSON.parse(post.mobiledoc)
              if (mobiledoc.cards[0][1].metadata) {
                // Get video id
                videoId = mobiledoc.cards[0][1].metadata.video_id

                // Get post text
                mobiledoc.sections
                  .flat(Infinity)
                  .forEach((element: string | any[]) => {
                    if (element.length > 1) {
                      sections.push(element)
                    }
                  })
              }
            } else if (post.lexical) {
              const lexical = JSON.parse(post.lexical)
              lexical.root.children.forEach(
                (child: {
                  type: string
                  children: any[]
                  metadata: { video_id: string }
                }) => {
                  // Get post text
                  if (child.type === 'paragraph') {
                    child.children.forEach(paragraph => {
                      sections.push(paragraph.text)
                    })
                    // Get video id
                  } else if (child.type === 'embed') {
                    videoId = child.metadata.video_id
                  }
                },
              )
            }
            post.tags.forEach((tag: Tag) => {
              const postInfo = {
                id: post.id,
                title: post.title,
                videoId,
                text: sections,
                thumbNail:
                  post.custom_excerpt ||
                  // TODO: Change default image
                  'https://picsum.photos/seed/696/3000/2000',
                tag,
              }
              if (!tag.name.includes('#')) {
                if (accumulator[tag.name]) {
                  accumulator[tag.name].data.push(postInfo)
                } else {
                  accumulator[tag.name] = {
                    value: tag.name,
                    label: tag.name,
                    data: [postInfo],
                  }
                }
              }
            })
            return accumulator
          }, {}),
        )

        videoData.sort((a, b) => {
          // if (a.value === 'Basics' || b.value === 'Basics') {
          //   return 10000000000000
          // }
          return a.value.localeCompare(b.value)
        })

        setData(videoData)
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const renderItem = ({ item }: { item: PostData }) => {
    if (categories.includes(item.tag.name) || categories.length === 0) {
      return (
        <View style={styles.item}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Video', {
                postTitle: item.title,
                videoId: item.videoId,
                text: item.text,
                thumbNail: item.thumbNail,
              })
            }>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={item.thumbNail} />
            </View>
          </TouchableOpacity>
        </View>
      )
    } else {
      return <View />
    }
  }

  const renderSectionHeader = ({
    section: { value },
  }: {
    section: { value: string }
  }) => {
    if (categories.includes(value) || categories.length === 0) {
      return <Text style={styles.header}>{value}</Text>
    } else {
      return <View />
    }
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.view_container}>
          <MultipleSelectList
            setSelected={(val: any) => setCategories(val)}
            data={data!}
            save="value"
            label="Categories"
          />
          <SectionList
            sections={data!}
            renderItem={renderItem}
            initialNumToRender={5}
            renderSectionHeader={renderSectionHeader}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view_container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  item: {
    marginVertical: 8,
  },
  imageContainer: {
    flex: 1,
    width: 'auto',
    height: 200,
  },
  image: {
    flex: 1,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
  },
})

export default VideosScreen
