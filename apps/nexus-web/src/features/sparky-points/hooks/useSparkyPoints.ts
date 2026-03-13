import { ASSETS } from "@/lib/constants/assets";
import type { PointsTransactionType, TaskItemType, RewardItemType } from "../types";

// TODO: REVISIT WHEN THE REAL API IS IMPLEMENTED
export function useSparkyPoints(): {
  userPoints: number,
  userHistory: PointsTransactionType[],
  tasks: TaskItemType[],
  rewards: RewardItemType[]
} {
  return {
    userPoints: 10,
    userHistory: [
      {
        type: "plus",
        data: {
          id: "1e27f485-c49f-460e-94d8-5319657719aa",
          name: "Task Name",
          points: 0,
          description: "Lorem ipsum dolor sit amet, consectetur...",
          timestamp: new Date()
        }
      },
      {
        type: "minus",
        data: {
          id: "ed08c748-9a9e-477f-a05e-f215df7286c7",
          name: "Reward Name",
          cost: 0,
          src: ASSETS.SPARKY_POINTS.CIRBY_DISPLAY,
          timestamp: new Date()
        }
      }
    ],
    tasks: [
      {
        id: "b40ca8ab-b10c-47d8-a371-5972dd604436",
        name: "Task Name",
        points: 0,
        description: "Dolore enim et cupidatat pariatur ipsum laborum laborum. Deserunt est veniam aliqua culpa labore ut culpa proident. Et officia ea officia reprehenderit aute ex. Dolor dolore deserunt nostrud dolor sit laborum duis. Incididunt veniam sint duis reprehenderit aliqua laborum ad amet labore laborum ut do sint consequat. Deserunt quis est ullamco eu proident labore aute minim sit consequat fugiat tempor tempor."
      },
      {
        id: "a3c8f573-6035-4553-a3a5-9f397e7298e0",
        name: "Task Name",
        points: 0,
        description: "Pariatur laborum labore reprehenderit ipsum adipisicing duis aliquip deserunt. Incididunt commodo anim incididunt amet Lorem consequat ea nostrud sunt. Eu irure sit eu esse. Consectetur nulla minim esse est consequat deserunt minim."
      },
      {
        id: "1d3cd6f0-e788-4507-b793-f90a3ff66732",
        name: "Task Name",
        points: 0,
        description: "Adipisicing pariatur id ullamco occaecat incididunt labore occaecat. Deserunt amet esse proident dolore mollit deserunt reprehenderit. Ullamco ut id consectetur dolore exercitation aliqua sit duis sunt. Ea eu laboris laborum ad exercitation eiusmod dolore proident."
      },
    ],
    rewards: [
      {
        id: "c963564d-0b5e-4c8d-a7d1-21b11ce42a93",
        name: "Reward Name",
        cost: 10,
        src: ASSETS.SPARKY_POINTS.CIRBY_DISPLAY
      },
      {
        id: "391fb745-4294-40ba-9d16-28e583e85cee",
        name: "Reward Name",
        cost: 5,
        src: ASSETS.SPARKY_POINTS.CIRBY_DISPLAY
      },
      {
        id: "31d8c7cb-d6a6-41b3-8409-589375cd8d35",
        name: "Reward Name",
        cost: 20,
        src: ASSETS.SPARKY_POINTS.CIRBY_DISPLAY
      },
      {
        id: "e98580ea-9e1a-41c1-933e-12ccde6a1b11",
        name: "Reward Name",
        cost: 0,
        src: ASSETS.SPARKY_POINTS.CIRBY_DISPLAY
      },
      {
        id: "dec42b2f-47a2-4994-9929-c4370e1b70bb",
        name: "Reward Name",
        cost: 0,
        src: ASSETS.SPARKY_POINTS.CIRBY_DISPLAY
      },
      {
        id: "2c19479b-bc93-42bf-87ed-4598b1aced01",
        name: "Reward Name",
        cost: 0,
        src: ASSETS.SPARKY_POINTS.CIRBY_DISPLAY
      },
      {
        id: "27c3796f-e016-4da4-97ff-f4df1641ecf4",
        name: "Reward Name",
        cost: 0,
        src: ASSETS.SPARKY_POINTS.CIRBY_DISPLAY
      },
    ]
  }
}
