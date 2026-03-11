// TODO - REVISIT WHEN THE REAL API IS IMPLEMENTED

export type TaskItem = {
  id: string,
  name: string,
  points: number,
  description: string,
}

export type RewardItem = {
  id: string,
  name: string,
  cost: number,
  src: string,
}

export type PointsTransaction = {
  type: "plus",
  data: TaskItem & { timestamp: Date }
} | {
  type: "minus",
  data: RewardItem & { timestamp: Date }
}
