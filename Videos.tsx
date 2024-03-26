import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import {
  SectionList,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { MultipleSelectList } from 'react-native-dropdown-select-list'

import { RootStackParamList } from './App'

interface VideoProps {
  value: string
  label: string
  data: [PostData]
}

interface PostData {
  id: string
  title: string
  custom_excerpt: string
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

function VideosScreen({ navigation }: VideosScreenProps) {
  const [data, setData] = useState<VideoProps[]>()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const url =
    'https://ultrasoundguidance.ghost.io/ghost/api/content/posts/?key=83ac49fe05b280e4d7ce44909c&include=tags&filter=tag:hash-procedure&limit=all'

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url, {
        headers: { 'Accept-Version': 'v5.0' },
      })
      const postData = await response.json()

      const videoData: VideoProps[] = Object.values(
        postData.posts.reduce((accumulator: any, post: any) => {
          post.tags.forEach((tag: Tag) => {
            const postInfo = {
              id: post.id,
              title: post.title,
              custom_excerpt: post.custom_excerpt,
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
        if (a.value === 'Basics' || b.value === 'Basics') {
          return 2
        }
        return a.value.localeCompare(b.value)
      })

      setData(videoData)
      setLoading(false)
    }
    fetchData().catch(console.error)
  }, [])

  const renderItem = ({ item }: { item: PostData }) => {
    if (categories.includes(item.tag.name) || categories.length === 0) {
      return (
        <View style={styles.item}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Video', {
                postId: item.id,
              })
            }>
            <Text style={styles.title}>{item.title}</Text>
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
    <SafeAreaView style={styles.container}>
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
            renderSectionHeader={renderSectionHeader}
          />
        </View>
      )}
    </SafeAreaView>
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
  },
  item: {
    marginVertical: 8,
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
