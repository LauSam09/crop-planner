import classNames from "classnames";
import { format, isFuture, differenceInWeeks, isThisWeek } from "date-fns";

import type { Stage } from "~/models/crop";

export interface SowingDetailProps {
  currentStage: Stage;
  date: Date;
}

const SowingDetails = ({ currentStage, date }: SowingDetailProps) => {
  const today = new Date();
  let text: string;

  const getFutureWording = () => {
    const weekCount = differenceInWeeks(date, today, {
      roundingMethod: "ceil",
    });

    return isThisWeek(date, { weekStartsOn: 1 })
      ? "this week"
      : weekCount === 1
      ? `next week`
      : `in ${weekCount} weeks`;
  };

  const getPastWording = () => {
    const weekCount = differenceInWeeks(today, date, {
      roundingMethod: "ceil",
    });

    return isThisWeek(date, { weekStartsOn: 1 })
      ? "this week"
      : weekCount === 1
      ? `last week`
      : `${weekCount} weeks ago`;
  };

  const formattedDate = format(date, "dd/MM/yy");
  const interval = isFuture(date) ? getFutureWording() : getPastWording();

  switch (currentStage) {
    case "growing":
      text = `Planted ${interval} (${formattedDate})`;
      break;
    case "planning":
      text = `Plant ${interval} (${formattedDate})`;
      break;
    case "storing":
      text = `Harvested ${interval} (${formattedDate})`;
      break;
  }

  return (
    <div
      className={classNames("rounded border p-1 text-center", {
        "border-blue-500 bg-blue-500/40 hover:bg-blue-500/30 dark:hover:bg-blue-500/50":
          currentStage === "planning",
        "border-green-500 bg-green-500/40 hover:bg-green-500/30 dark:hover:bg-green-500/50":
          currentStage === "growing",
        "border-orange-500 bg-orange-500/40 hover:bg-orange-500/30 dark:hover:bg-orange-500/50":
          currentStage === "storing",
      })}
    >
      {text}
    </div>
  );
};

export default SowingDetails;
