import { format, isFuture, differenceInWeeks } from "date-fns";
import type { Stage } from "~/models/crop";

interface SowingDetailProps {
  number: number;
  currentStage: Stage;
  date: Date;
}

const SowingDetails = ({ number, currentStage, date }: SowingDetailProps) => {
  const today = new Date();
  let text: string;

  const formattedDate = format(date, "dd/MM/yy");
  const interval = isFuture(date)
    ? `in ${differenceInWeeks(date, today)} weeks`
    : `${differenceInWeeks(today, date)} weeks ago`;

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
