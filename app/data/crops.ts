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

const mockCrops: { [key: string]: Crop } = {
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
    return Object.values(mockCrops);
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
  crops.reverse();

  return crops;
};

export const fetchCrop = async (userId: string, cropId: string) => {
  if (process.env.MOCKING) {
    return mockCrops[cropId];
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

export const addSowing = async (
  userId: string,
  cropId: string,
  sowing: Omit<Sowing, "id">
) => {
  if (process.env.MOCKING) {
    const id = Math.max(...mockCrops[cropId].sowings.map((s) => s.id), 0) + 1;
    mockCrops[cropId].sowings.push({ ...sowing, id });
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
};

export const deleteSowing = async (
  userId: string,
  cropId: string,
  sowingId: number
) => {
  if (process.env.MOCKING) {
    const crop = mockCrops[cropId];
    const sowing = crop?.sowings.find((s) => s.id === sowingId);

    if (!crop || !sowing) {
      throw new Error("Sowing not found");
    }

    crop.sowings = crop.sowings.filter((s) => s.id !== sowingId);
    return;
  }

  const documentSnapshot = await db.collection("crops").doc(cropId).get();
  const cropEntity = documentSnapshot.data() as CropEntity;
  const sowing = cropEntity?.sowings.find((s) => s.id === sowingId);

  if (!cropEntity || cropEntity.userId !== userId || !sowing) {
    throw new Error("Sowing not found");
  }

  await db
    .collection("crops")
    .doc(cropId)
    .update({
      sowings: cropEntity.sowings.filter((s) => s.id !== sowingId),
    });
};

export const deleteCrop = async (userId: string, cropId: string) => {
  if (process.env.MOCKING) {
    const crop = mockCrops[cropId];

    if (!crop) {
      throw new Error("Crop not found");
    }

    delete mockCrops[cropId];
    return;
  }

  const documentSnapshot = await db.collection("crops").doc(cropId).get();
  const cropEntity = documentSnapshot.data() as CropEntity;

  if (!cropEntity || cropEntity.userId !== userId) {
    throw new Error("Crop not found");
  }

  await db.collection("crops").doc(cropId).delete();
};

export const addCrop = async (userId: string, crop: Pick<Crop, "name">) => {
  if (process.env.MOCKING) {
    const id = Math.max(...Object.values(mockCrops).map((c) => +c.id), 0) + 1;

    mockCrops[id] = {
      id: String(id),
      name: crop.name,
      created: new Date(),
      sowings: [],
      userId: "1",
    };

    return id;
  }

  const cropEntity: Omit<CropEntity, "id"> = {
    userId,
    created: firestore.Timestamp.now(),
    name: crop.name,
    sowings: [],
  };

  const documentReference = await db.collection("crops").add(cropEntity);
  return documentReference.id;
};

export const progressCrop = async (
  userId: string,
  cropId: string,
  sowingId: number,
  date: Date = new Date()
  /* TODO: Add stage metadata */
) => {
  if (process.env.MOCKING) {
    const crop = mockCrops[cropId];
    const sowing = crop?.sowings.find((s) => s.id === sowingId);

    if (!crop || !sowing) {
      throw new Error("Sowing not found");
    }

    // TODO: Factor out this logic
    switch (sowing.currentStage) {
      case "planning": {
        sowing.currentStage = "growing";
        sowing.stages.growing = {
          date,
        };
        break;
      }
      case "growing": {
        sowing.currentStage = "storing";
        sowing.stages.storing = {
          date,
        };
        break;
      }
      case "storing": {
        throw new Error(
          "progressCrop was invoked for a crop that is already being stored"
        );
      }
    }

    return;
  }

  const documentSnapshot = await db.collection("crops").doc(cropId).get();
  const cropEntity = documentSnapshot.data() as CropEntity;
  const sowing = cropEntity?.sowings.find((s) => s.id === sowingId);

  if (!cropEntity || cropEntity.userId !== userId || !sowing) {
    throw new Error("Sowing not found");
  }

  // TODO: Factor out this logic
  switch (sowing.currentStage) {
    case "planning": {
      sowing.currentStage = "growing";
      sowing.stages.growing = {
        date: firestore.Timestamp.fromDate(date),
      };
      break;
    }
    case "growing": {
      sowing.currentStage = "storing";
      sowing.stages.storing = {
        date: firestore.Timestamp.fromDate(date),
      };
      break;
    }
    case "storing": {
      throw new Error(
        "progressCrop was invoked for a crop that is already being stored"
      );
    }
  }

  await db.collection("crops").doc(cropId).update({
    sowings: cropEntity.sowings,
  });
};
