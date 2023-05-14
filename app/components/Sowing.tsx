import classNames from "classnames";
import type { Sowing as SowingModel } from "~/models/crop";
import type { Stage } from "~/models/crop";

interface SowingProps {
  currentStage: Stage;
  stages: SowingModel["stages"];
}

export const Sowing = (props: SowingProps) => {
  const { currentStage, stages } = props;

  let text: string;

  switch (currentStage) {
    case "planning":
      text = `Planned for ${new Date(
        stages.planning!.date
      ).toLocaleDateString()}`;
      break;
    case "growing":
      text = `Growing since ${new Date(
        stages.growing!.date
      ).toLocaleDateString()}`;
      break;
    case "storing":
      text = `Harvested on ${new Date(
        stages.storing!.date
      ).toLocaleDateString()}`;
      break;
    default:
      throw new Error(`Unexpected stage: ${currentStage}`);
  }

  return (
    <div
      className={classNames("rounded border p-1 text-center", {
        "border-blue-500 bg-blue-500/40": currentStage === "planning",
        "border-green-500 bg-green-500/40": currentStage === "growing",
        "border-orange-500 bg-orange-500/40": currentStage === "storing",
      })}
    >
      {text}
    </div>
  );
};
