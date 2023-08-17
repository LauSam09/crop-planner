import { isBefore, isSameDay } from "date-fns";

import type { Sowing } from "~/models/crop";

const compareSowingDate = (sowingA: Sowing, sowingB: Sowing) => {
  const sowingADate = sowingA.stages[sowingA.currentStage]!.date;
  const sowingBDate = sowingB.stages[sowingB.currentStage]!.date;

  if (isSameDay(sowingADate, sowingBDate)) {
    return 0;
  } else if (isBefore(sowingADate, sowingBDate)) {
    return 1;
  }

  return -1;
};

export const compareSowings = (sowingA: Sowing, sowingB: Sowing) => {
  switch (sowingA.currentStage) {
    case "planning":
      switch (sowingB.currentStage) {
        case "planning":
          return compareSowingDate(sowingA, sowingB);
        case "growing":
        case "storing":
          return -1;
      }
    case "growing":
      switch (sowingB.currentStage) {
        case "planning":
          return 1;
        case "growing":
          return compareSowingDate(sowingA, sowingB);
        case "storing":
          return -1;
      }
    case "storing":
      switch (sowingB.currentStage) {
        case "planning":
        case "growing":
          return 1;
        case "storing":
          return compareSowingDate(sowingA, sowingB);
      }
  }
};
