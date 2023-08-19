import type { firestore } from "firebase-admin";

export type Stage = "planning" | "growing" | "storing";

export interface SowingEntity {
  id: number;
  created: firestore.Timestamp;
  currentStage: Stage;
  stages: {
    planning?: {
      date: firestore.Timestamp;
    };
    growing?: {
      date: firestore.Timestamp;
    };
    storing?: {
      date: firestore.Timestamp;
    };
  };
}

export interface Sowing {
  id: number;
  created: Date;
  currentStage: Stage;
  stages: {
    planning?: {
      date: Date;
    };
    growing?: {
      date: Date;
    };
    storing?: {
      date: Date;
    };
  };
}

export type SowingViewModel = Sowing & {
  index: number;
};

export interface CropEntity {
  id: string; // TODO: Shouldn't have ID
  name: string;
  created: firestore.Timestamp;
  userId: string;
  sowings: Array<SowingEntity>;
}

export interface Crop {
  id: string;
  name: string;
  created: Date;
  userId: string;
  sowings: Array<Sowing>;
}
