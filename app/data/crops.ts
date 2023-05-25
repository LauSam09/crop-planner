import type { Crop } from "~/models/crop";
import { db } from "~/utils/firebase.server";

const carrots: Crop = {
  id: "1",
  name: "Carrots",
  created: "2023-01-01T09:00:00Z",
  sowings: [
    {
      created: "2023-01-01T09:00:00Z",
      currentStage: "planning",
      stages: {
        planning: {
          date: "2023-06-03T09:00:00Z",
        },
      },
    },
    {
      created: "2023-01-01T09:00:00Z",
      currentStage: "growing",
      stages: {
        planning: {
          date: "2023-05-27T09:00:00Z",
        },
        growing: {
          date: "2023-05-27T09:00:00Z",
        },
      },
    },
    {
      created: "2023-01-01T09:00:00Z",
      currentStage: "storing",
      stages: {
        planning: {
          date: "2023-04-23T09:00:00Z",
        },
        growing: {
          date: "2023-04-23T09:00:00Z",
        },
        storing: {
          date: "2023-05-30T09:00:00Z",
        },
      },
    },
  ],
};

const potatoes: Crop = {
  id: "2",
  name: "Potatoes",
  created: "2023-01-01T09:00:00Z",
  sowings: [
    {
      created: "2023-01-01T09:00:00Z",
      currentStage: "planning",
      stages: {
        planning: {
          date: "2023-06-03T09:00:00Z",
        },
      },
    },
  ],
};

const cauliflower: Crop = {
  id: "3",
  name: "Cauliflower",
  created: "2023-01-01T09:00:00Z",
  sowings: [],
};

export const fetchCrops = async () => {
  if (process.env.MOCKING) {
    return [carrots, potatoes, cauliflower];
  }

  const querySnapshot = await db.collection("crops").get();
  const data: Array<Crop> = [];

  querySnapshot.forEach((doc) =>
    data.push({ ...doc.data(), id: doc.id } as Crop)
  );

  return data;
};
