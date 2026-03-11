// TODO - REVISIT WHEN THE REAL API IS IMPLEMENTED

type TaskItem = {
  id: string,
  name: string,
  points: number,
  description: string,
}

type RewardItem = {
  id: string,
  name: string,
  cost: number,
  src: string,
}

type HistoryItemProps = {
  type: "plus",
  data: TaskItem & { timestamp: Date }
} | {
  type: "minus",
  data: RewardItem & { timestamp: Date }
}

export type { TaskItem, RewardItem, HistoryItemProps }