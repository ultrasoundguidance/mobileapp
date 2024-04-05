import { useTheme } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import axios from 'axios'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

import { SkModernistText } from './SkModernistText'
import { SkModernistTitleText } from './SkModernistTitleText'
import { RootStackParamList } from '../../App'
import { AtlasTypes } from '../screens/Home'
import { UGTheme } from '../styles/Theme'
import { Lexical, PostData, Tag } from '../types/Posts'

interface VideoProps {
  value: string
  label: string
  data: [PostData]
}

type VideosScreenProp = StackScreenProps<RootStackParamList, 'Videos'>

function VideosScreen({ navigation, route }: VideosScreenProp) {
  const [data, setData] = useState<VideoProps[]>()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width)
  const { colors } = useTheme()

  Dimensions.addEventListener('change', () => {
    setScreenWidth(Dimensions.get('window').width)
  })

  useEffect(() => {
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
            if (post.lexical) {
              const lexical: Lexical = JSON.parse(post.lexical)
              post.tags.forEach((tag: Tag) => {
                const postInfo = {
                  id: post.id,
                  title: post.title,
                  posts: lexical.root.children,
                  thumbNail:
                    post.custom_excerpt ||
                    require('../../assets/images/icon-dark.png'),
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
            }

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

  const ThumbNailItem = ({ thumbNail }: { thumbNail: string }) => {
    return (
      <View>
        <Image
          style={styles.imageContainer}
          source={thumbNail}
          contentFit="contain"
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={{ paddingBottom: 40 }}>
          <View style={styles.multipleSelectContainer}>
            <MultipleSelectList
              placeholder="Select categories"
              setSelected={(val: any) => setCategories(val)}
              data={data!}
              save="value"
              label="Categories"
            />
          </View>
          <ScrollView>
            {data!.map(item => {
              if (categories.includes(item.label) || categories.length === 0) {
                return (
                  <View key={item.value}>
                    <SkModernistTitleText style={styles.header}>
                      {item.label}
                    </SkModernistTitleText>
                    <View
                      style={[styles.contentWrapper, { width: screenWidth }]}>
                      {item.data.map(item => {
                        return (
                          <View key={item.id} style={styles.contentContainer}>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate('Video', {
                                  postTitle: item.title,
                                  posts: item.posts,
                                  thumbNail: item.thumbNail,
                                })
                              }}>
                              <ThumbNailItem thumbNail={item.thumbNail} />
                            </TouchableOpacity>
                            <SkModernistText style={styles.title}>
                              {item.title}
                            </SkModernistText>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                )
              }
            })}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  multipleSelectContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  contentWrapper: {
    marginHorizontal: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  view_container: {
    flex: 1,
  },
  header: {
    fontSize: 35,
    paddingVertical: 10,
    alignSelf: 'center',
  },
  imageContainer: {
    flex: 1,
    width: 320,
    height: 160,
    backgroundColor: 'black',
  },
  contentContainer: {
    width: 320,
  },
  title: {
    flex: 1,
    fontSize: 24,
    paddingBottom: 25,
    color: UGTheme.colors.primary,
  },
})

export default VideosScreen
