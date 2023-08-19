import { format, isFuture, differenceInWeeks, isThisWeek } from "date-fns";
import type { Stage } from "~/models/crop";

interface SowingDetailProps {
  number: number;
  currentStage: Stage;
  date: Date;
}

const SowingDetails = ({ number, currentStage, date }: SowingDetailProps) => {
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
      text = `Growing since ${formattedDate} (${interval})`;
      break;
    case "planning":
      text = `Planned for ${formattedDate} (${interval})`;
      break;
    case "storing":
      text = `Harvested on ${formattedDate} (${interval})`;
      break;
  }

  return (
    <div>
      {number}: {text}
    </div>
  );
};

export default SowingDetails;
