import { useEffect, useState } from 'react'
import { SectionList, Text, View, StatusBar, StyleSheet } from 'react-native'

interface VideoProps {
  tag_name: string
  data: [
    {
      id: string
      title: string
      custom_excerpt: string
      tag: Tag
    },
  ]
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

function VideosScreen() {
  const [data, setData] = useState<VideoProps[]>()
  const [loading, setLoading] = useState(true)
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
                  tag_name: tag.name,
                  data: [postInfo],
                }
              }
            }
          })
          return accumulator
        }, {}),
      )

      videoData.sort((a, b) => {
        if (a.tag_name === 'Basics' || b.tag_name === 'Basics') {
          return 2
        }
        return a.tag_name.localeCompare(b.tag_name)
      })

      setData(videoData)
      setLoading(false)
    }
    fetchData().catch(console.error)
  }, [])

  const renderSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <SectionList
            sections={data!}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            )}
            renderSectionHeader={({ section: { tag_name } }) => (
              <Text style={styles.header}>{tag_name}</Text>
            )}
            ItemSeparatorComponent={renderSeparator}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    padding: 16,
    backgroundColor: '#fff',
  },
  item: {
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
    fontWeight: 'bold',
  },
  separator: {
    backgroundColor: 'grey',
    height: 0.5,
  },
  title: {
    fontSize: 24,
  },
})

export default VideosScreen
