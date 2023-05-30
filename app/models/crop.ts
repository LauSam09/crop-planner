export type Stage = "planning" | "growing" | "storing";

export interface Sowing {
  created: string; // TODO: Investigate timestamp type
  currentStage: Stage;
  stages: {
    planning?: {
      date: string; // TODO: Investigate timestamp type
    };
    growing?: {
      date: string; // TODO: Investigate timestamp type
    };
    storing?: {
      date: string; // TODO: Investigate timestamp type
    };
  };
}

export interface Crop {
  id: string;
  name: string;
  created: string; // TODO: Investigate timestamp type
  userId: string;
  sowings: Array<Sowing>;
}
