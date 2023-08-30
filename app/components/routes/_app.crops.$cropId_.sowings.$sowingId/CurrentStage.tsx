import classNames from "classnames";
import { format } from "date-fns";
import type { Stage } from "~/models/crop";

export type CurrentStageProps = {
  currentStage: Stage;
  date: Date;
};

export const CurrentStage = ({ currentStage, date }: CurrentStageProps) => {
  return (
    <section className="space-y-1">
      <h2>Current Stage</h2>
      <div
        className={classNames("flex flex-col rounded p-2 border", {
          "border-blue-500 bg-blue-500/40": currentStage === "planning",
          "border-green-500 bg-green-500/40": currentStage === "growing",
          "border-orange-500 bg-orange-500/40": currentStage === "storing",
        })}
      >
        <span>
          {formatStage(currentStage)} {format(new Date(date), "dd/MM/yy")}
        </span>
      </div>
    </section>
  );
};

const formatStage = (stage: Stage) => {
  switch (stage) {
    case "planning":
      return "Planned for";
    case "growing":
      return "Planted";
    case "storing":
      return "Harvested";
  }
};
