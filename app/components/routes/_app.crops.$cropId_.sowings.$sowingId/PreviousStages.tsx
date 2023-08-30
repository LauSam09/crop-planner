import type { SerializeFrom } from "@remix-run/node";
import classNames from "classnames";
import { format } from "date-fns";
import type { Sowing, Stage } from "~/models/crop";

export type PreviousStagesProps = {
  currentStage: Stage;
  stages: SerializeFrom<Sowing["stages"]>;
};

export const PreviousStages = ({
  currentStage,
  stages,
}: PreviousStagesProps) => {
  const previousStages = Object.entries(stages)
    .filter(([stage]) => stage !== currentStage && stage !== "planning")
    .reverse();

  if (previousStages.length === 0) {
    return null;
  }

  return (
    <section className="space-y-1">
      <h2>Previous stages</h2>
      <div className="flex flex-col gap-2">
        {previousStages.map(([stage, values]) => (
          <div
            key={stage}
            className={classNames("flex flex-col rounded p-2 border", {
              "border-blue-500 bg-blue-500/40": stage === "planning",
              "border-green-500 bg-green-500/40": stage === "growing",
              "border-orange-500 bg-orange-500/40": stage === "storing",
            })}
          >
            <span>
              {formatStage(stage as Stage)}{" "}
              {format(new Date(values.date), "dd/MM/yy")}
            </span>
          </div>
        ))}
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
