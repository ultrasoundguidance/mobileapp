import { StackScreenProps } from '@react-navigation/stack'
import axios from 'axios'
import { Image } from 'expo-image'
import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
} from 'react-native'
import { MultiSelect } from 'react-native-element-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'

import { SkModernistText } from './SkModernistText'
import { SkModernistTitleText } from './SkModernistTitleText'
import { RootStackParamList } from '../../App'
import { UG_URL } from '../Constants'
import { useUserContext } from '../contexts/AppContext'
import { AtlasTypes } from '../screens/Home'
import { UGTheme } from '../styles/Theme'
import { Lexical, PostData, Tag, WatchedVideo } from '../types/Posts'

interface PostProps {
  value: string
  label: string
  data: [PostData]
}

type VideosScreenProp = StackScreenProps<RootStackParamList, 'Videos'>

function VideosScreen({ navigation, route }: VideosScreenProp) {
  const { userData } = useUserContext()
  const [data, setData] = useState<PostProps[]>()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width)
  const [refreshing, setRefreshing] = useState(false)

  Dimensions.addEventListener('change', () => {
    setScreenWidth(Dimensions.get('window').width)
  })

  const getVideoProgress = async () => {
    try {
      const response = await axios.post(`${UG_URL}/video/getVideoProgress`, {
        email: userData?.email,
      })

      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  const getPublishedPosts = () => {
    const tag =
      route.params.type === AtlasTypes.diagnostic ? 'msk' : 'hash-procedure'
    axios
      .post(`${UG_URL}/post/getPublishedPosts`, {
        tag,
      })
      .then(async response => {
        const postData: PostProps[] = Object.values(
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
                  watchedVideos: [],
                  videoCount: 0,
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

        postData.sort((a, b) => {
          return a.value.localeCompare(b.value)
        })

        const videoProgress = await getVideoProgress()
        postData.map(posts => {
          posts.data.forEach(post => {
            if (videoProgress[post.id]) {
              const videoProgressKeys = Object.keys(videoProgress[post.id])
              const lastKey = videoProgressKeys[videoProgressKeys.length - 1]
              if (lastKey === 'videoCount') {
                post.videoCount = videoProgress[post.id].videoCount
                delete videoProgress[post.id].videoCount
              }
              post.videoCount = post.posts.filter(
                post => post.type === 'embed',
              ).length
              post.watchedVideos.push(videoProgress[post.id])
            } else {
              post.videoCount = post.posts.filter(
                post => post.type === 'embed',
              ).length
            }
          })
        })

        setData(postData)
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getPublishedPosts()
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getPublishedPosts()
    setRefreshing(false)
  }, [])

  const ThumbNailItem = ({
    thumbNail,
    watchedVideos,
    videoCount,
  }: {
    thumbNail: string
    watchedVideos: [{ [key: string]: WatchedVideo }]
    videoCount: number
  }) => {
    const numOfVideos = videoCount
    const TOTAL_WIDTH = 320
    let width = 0

    if (Object.keys(watchedVideos).length > 0) {
      let progressPosition = 0
      watchedVideos.forEach(videos => {
        Object.values(videos).forEach(video => {
          progressPosition += video.progressPosition
        })
      })

      width = (progressPosition / numOfVideos) * TOTAL_WIDTH
    }

    return (
      <View style={styles.imageContainer}>
        <Image
          style={styles.imageContainer}
          source={thumbNail}
          contentFit="contain"
        />
        <View
          style={{
            width,
            height: 8,
            backgroundColor: UGTheme.colors.primaryBlue,
          }}
        />
      </View>
    )
  }

  const renderItem = (item: { label: string; value: string }) => {
    const selected = categories.includes(item.value)
    return (
      <View
        style={[
          styles.item,
          { backgroundColor: selected ? UGTheme.colors.primary : 'white' },
        ]}>
        <SkModernistText
          style={[styles.textItem, { color: selected ? 'white' : 'black' }]}>
          {item.label}
        </SkModernistText>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={UGTheme.colors.primary} />
        </View>
      ) : (
        <View style={{ paddingBottom: 40 }}>
          <View style={styles.multipleSelectContainer}>
            <MultiSelect
              data={data!}
              value={categories}
              labelField="label"
              valueField="value"
              onChange={(val: any) => setCategories(val)}
              selectedStyle={styles.selected}
              selectedTextStyle={{ color: 'white' }}
              activeColor={UGTheme.colors.primary}
              search
              placeholder="Select categories"
              placeholderStyle={styles.placeHolder}
              renderItem={renderItem}
              searchPlaceholder="Search"
              style={styles.multiSelect}
              fontFamily="Sk-Modernist-Regular"
              inputSearchStyle={{ borderRadius: 10 }}
            />
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
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
                                  postId: item.id,
                                  postTitle: item.title,
                                  posts: item.posts,
                                  thumbNail: item.thumbNail,
                                  watchedVideos:
                                    item.watchedVideos as unknown as [
                                      {
                                        [key: string]: WatchedVideo
                                      },
                                    ],
                                  videoCount: item.videoCount,
                                })
                              }}>
                              <ThumbNailItem
                                thumbNail={item.thumbNail}
                                watchedVideos={
                                  item.watchedVideos as unknown as [
                                    {
                                      [key: string]: WatchedVideo
                                    },
                                  ]
                                }
                                videoCount={item.videoCount}
                              />
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
    lineHeight: 35,
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
    lineHeight: 24,
    paddingBottom: 25,
    color: UGTheme.colors.primary,
  },
  placeHolder: {
    fontWeight: 'bold',
    fontSize: 20,
    color: UGTheme.colors.primary,
  },
  multiSelect: {
    borderBottomColor: UGTheme.colors.secondaryBlue,
    borderBottomWidth: 2,
  },
  selected: {
    borderRadius: 12,
    padding: 5,
    backgroundColor: UGTheme.colors.primary,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    lineHeight: 16,
    fontSize: 16,
  },
})

export default VideosScreen
