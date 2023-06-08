import { firestore } from "firebase-admin";

export type Stage = "planning" | "growing" | "storing";

export interface SowingEntity {
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

export interface CropEntity {
  id: string;
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
