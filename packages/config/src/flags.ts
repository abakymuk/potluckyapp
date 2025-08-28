export type FeatureFlag =
  | 'ONLINE_ORDERING_V1'
  | 'ORDER_QUEUE_V1'
  | 'AI_ADVISOR_V1'

export type FeatureFlags = Record<FeatureFlag, boolean>
