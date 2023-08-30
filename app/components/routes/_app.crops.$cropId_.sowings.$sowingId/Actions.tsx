import { Form } from "@remix-run/react";
import classNames from "classnames";

import type { Stage } from "~/models/crop";

export type ActionsProps = {
  currentStage: Stage;
};

export const Actions = ({ currentStage }: ActionsProps) => {
  const hasNextStage = currentStage !== "storing";
  let nextStage: Stage | undefined;

  switch (currentStage) {
    case "planning":
      nextStage = "growing";
      break;
    case "growing":
      nextStage = "storing";
      break;
    case "storing":
      nextStage = undefined;
      break;
  }

  return (
    <section>
      <h2>Actions</h2>
      <Form method="post">
        <div className="flex justify-end gap-2">
          {hasNextStage && (
            <button
              name="intent"
              value="progress"
              className={classNames(
                "rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                {
                  "bg-green-600 focus-visible:outline-green-600 hover:bg-green-500":
                    nextStage === "growing",
                  "bg-orange-500 focus-visible:outline-orange-500 hover:bg-orange-400":
                    nextStage === "storing",
                }
              )}
            >
              {formStageImperative(nextStage as Stage)}
            </button>
          )}
          <button
            name="intent"
            value="delete"
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Delete
          </button>
        </div>
      </Form>
    </section>
  );
};

const formStageImperative = (stage: Stage) => {
  switch (stage) {
    case "planning":
      return "Plan";
    case "growing":
      return "Plant";
    case "storing":
      return "Harvest";
  }
};
