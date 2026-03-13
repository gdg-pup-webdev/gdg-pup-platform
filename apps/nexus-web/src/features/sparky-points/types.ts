// TODO - REVISIT WHEN THE REAL API IS IMPLEMENTED

export type TaskItemType = {
  id: string,
  name: string,
  points: number,
  description: string,
}

export type RewardItemType = {
  id: string,
  name: string,
  cost: number,
  src: string,
}

export type PointsTransactionType = {
  type: "plus",
  data: TaskItemType & { timestamp: Date }
} | {
  type: "minus",
  data: RewardItemType & { timestamp: Date }
}
