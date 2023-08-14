import type { Crop, CropEntity } from "~/models/crop";
import { db } from "~/utils/firebase.server";

const carrots: Crop = {
  id: "1",
  name: "Carrots",
  created: new Date("2023-01-01T09:00:00Z"),
  userId: "1",
  sowings: [
    {
      created: new Date("2023-01-01T09:00:00Z"),
      currentStage: "planning",
      stages: {
        planning: {
          date: new Date("2023-06-03T09:00:00Z"),
        },
      },
    },
    {
      created: new Date("2023-01-01T09:00:00Z"),
      currentStage: "growing",
      stages: {
        planning: {
          date: new Date("2023-05-27T09:00:00Z"),
        },
        growing: {
          date: new Date("2023-05-27T09:00:00Z"),
        },
      },
    },
    {
      created: new Date("2023-01-01T09:00:00Z"),
      currentStage: "storing",
      stages: {
        planning: {
          date: new Date("2023-04-23T09:00:00Z"),
        },
        growing: {
          date: new Date("2023-04-23T09:00:00Z"),
        },
        storing: {
          date: new Date("2023-05-30T09:00:00Z"),
        },
      },
    },
  ],
};

const potatoes: Crop = {
  id: "2",
  name: "Potatoes",
  created: new Date("2023-01-01T09:00:00Z"),
  userId: "1",
  sowings: [
    {
      created: new Date("2023-01-01T09:00:00Z"),
      currentStage: "planning",
      stages: {
        planning: {
          date: new Date("2023-06-03T09:00:00Z"),
        },
      },
    },
  ],
};

const cauliflower: Crop = {
  id: "3",
  name: "Cauliflower",
  created: new Date("2023-01-01T09:00:00Z"),
  userId: "1",
  sowings: [],
};

const crops: { [key: string]: Crop } = {
  "1": carrots,
  "2": potatoes,
  "3": cauliflower,
};

const mapFn = (entity: CropEntity): Crop => ({
  ...entity,
  created: entity.created.toDate(),
  sowings: entity.sowings.map((sowing) => ({
    ...sowing,
    created: sowing.created.toDate(),
    stages: {
      planning: sowing.stages.planning
        ? {
            ...sowing.stages.planning,
            date: sowing.stages.planning.date.toDate(),
          }
        : undefined,
      growing: sowing.stages.growing
        ? {
            ...sowing.stages.growing,
            date: sowing.stages.growing.date.toDate(),
          }
        : undefined,
      storing: sowing.stages.storing
        ? {
            ...sowing.stages.storing,
            date: sowing.stages.storing.date.toDate(),
          }
        : undefined,
    },
  })),
});

export const fetchCrops = async (userId: string) => {
  if (process.env.MOCKING) {
    return [carrots, potatoes, cauliflower];
  }

  const querySnapshot = await db
    .collection("crops")
    .where("userId", "==", userId)
    .get();

  const data: Array<CropEntity> = [];

  querySnapshot.forEach((doc) =>
    data.push({ ...doc.data(), id: doc.id } as CropEntity),
  );

  return data.map(mapFn);
};

export const fetchCrop = async (userId: string, cropId: string) => {
  if (process.env.MOCKING) {
    return crops[cropId];
  }

  const querySnapshot = await db.collection("crops").doc(cropId).get();

  const cropEntity = {
    ...querySnapshot.data(),
    id: querySnapshot.id,
  } as CropEntity;

  if (cropEntity.userId !== userId) {
    throw new Error("Crop not found");
  }

  return mapFn(cropEntity);
};
