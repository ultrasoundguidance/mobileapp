export interface PostData {
  id: string
  title: string
  posts: [RootChild]
  thumbNail: string
  tag: Tag
  watchedVideos: [WatchedVideo]
  videoCount: number
}

export interface WatchedVideo {
  videoId: number
  watchedSeconds: number
  postId: string
  progressPosition: number
}

export interface Lexical {
  root: Root
}

export interface MobileDoc {
  version: string
  atoms: any[]
  cards: CardClass[][]
  markups: any[]
  sections: any[]
  ghostVersion: string
}

export interface CardClass {
  url: string
  html: string
  type: string
  metadata: Metadata
}

export interface Root {
  children: RootChild[]
  direction: string
  format: string
  indent: number
  type: string
  version: number
}

export interface RootChild {
  children?: ChildChild[]
  direction?: string
  format?: string
  indent?: number
  type: string
  version: number
  url?: string
  embedType?: string
  html?: string
  metadata?: Metadata
  caption?: string
}

export interface ChildChild {
  detail: number
  format: number
  mode: string
  style: string
  text: string
  type: string
  version: number
}

export interface Metadata {
  version: string
  provider_name: string
  provider_url: string
  width: number
  height: number
  domain_status_code: number
  video_id: number
  uri: string
}

export interface Tag {
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
