import { firestore } from "firebase-admin";
import type { Crop, CropEntity, Sowing, SowingEntity } from "~/models/crop";
import { compareSowings } from "~/utils/crops";
import { db } from "~/utils/firebase.server";

const carrots: Crop = {
  id: "1",
  name: "Carrots",
  created: new Date("2023-01-01T09:00:00Z"),
  userId: "1",
  sowings: [
    {
      id: 3,
      created: new Date("2023-01-01T09:00:00Z"),
      currentStage: "planning",
      stages: {
        planning: {
          date: new Date("2023-06-03T09:00:00Z"),
        },
      },
    },
    {
      id: 2,
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
      id: 1,
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
      id: 1,
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

  const cropEntities: Array<CropEntity> = [];

  querySnapshot.forEach((doc) => {
    cropEntities.push({ ...doc.data(), id: doc.id } as CropEntity);
  });

  const crops = cropEntities.map(mapFn);
  crops.forEach((c) => c.sowings.sort(compareSowings));

  return crops;
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

  const crop = mapFn(cropEntity);
  crop.sowings.sort(compareSowings);

  return crop;
};

export async function addSowing(
  userId: string,
  cropId: string,
  sowing: Sowing
) {
  if (process.env.MOCKING) {
    crops[cropId].sowings.push(sowing);
    return;
  }

  const querySnapshot = await db.collection("crops").doc(cropId).get();

  const cropEntity = querySnapshot.data() as CropEntity;

  if (!cropEntity || cropEntity.userId !== userId) {
    throw new Error("Crop not found");
  }

  const id = Math.max(...cropEntity.sowings.map((s) => s.id), 0) + 1;

  const sowingEntity: SowingEntity = {
    id,
    created: firestore.Timestamp.fromDate(sowing.created),
    currentStage: sowing.currentStage,
    stages: {
      planning: {
        date: firestore.Timestamp.fromDate(sowing.stages.planning!.date),
      },
    },
  };

  await db
    .collection("crops")
    .doc(cropId)
    .update({
      sowings: [...cropEntity.sowings, sowingEntity],
    });
}
