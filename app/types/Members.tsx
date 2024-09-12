export interface MemberDetails {
  id: string
  uuid: string
  email: string
  name: string
  note: null
  geolocation: string
  subscribed: boolean
  created_at: string
  updated_at: string
  labels: Label[]
  subscriptions: Subscription[]
  avatar_image: string
  comped: boolean
  email_count: number
  email_opened_count: number
  email_open_rate: null
  status: string
  last_seen_at: string
  email_suppression: EmailSuppression
  newsletters: Newsletter[]
  stripeId: string
  deviceId: string
}

export interface EmailSuppression {
  suppressed: boolean
  info: null
}

export interface Label {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Newsletter {
  id: string
  name: string
  description: string
  status: string
}

export interface Subscription {
  id: string
  tier: SubscriptionTier | undefined
  customer: Customer | undefined
  plan: Plan | undefined
  status: string
  start_date: string
  default_payment_card_last4: string
  cancel_at_period_end: boolean
  cancellation_reason: null
  current_period_end: null
  price: Price | undefined
  offer: null
}

export interface Customer {
  id: string
  name: string
  email: string
}

export interface Plan {
  id: string
  nickname: string
  interval: string
  currency: string
  amount: number
}

export interface Price {
  id: string
  price_id: string
  nickname: string
  amount: number
  interval: string
  type: string
  currency: string
  tier: PriceTier
}

export interface PriceTier {
  id: string
  name: string
  tier_id: string
}

export interface SubscriptionTier {
  id: string
  name: string
  slug: string
  monthly_price_id: string
  yearly_price_id: string
  description: string
  created_at: string
  updated_at: string
  type: string
  active: boolean
  welcome_page_url: string
  visibility: string
  trial_days: number
  monthly_price: number
  yearly_price: number
  currency: string
  expiry_at: null
}
