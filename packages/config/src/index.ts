export type FeatureFlags = {
  ONLINE_ORDERING_V1: boolean
  ORDER_QUEUE_V1: boolean
  AI_ADVISOR_V1: boolean
}

export const flags: FeatureFlags = {
  ONLINE_ORDERING_V1: false,
  ORDER_QUEUE_V1: false,
  AI_ADVISOR_V1: false,
}
