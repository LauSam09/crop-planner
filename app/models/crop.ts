export interface Sowing {
  created: string; // TODO: Investigate timestamp type
  currentStage: "planning";
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
  sowings: Array<Sowing>;
}
