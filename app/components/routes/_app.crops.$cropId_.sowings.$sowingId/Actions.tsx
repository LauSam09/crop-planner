import { Form } from "@remix-run/react";

import type { Stage } from "~/models/crop";
import { NextStageDialog } from "./NextStageDialog";

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
      <div className="flex justify-end gap-2">
        {hasNextStage && <NextStageDialog nextStage={nextStage!} />}
        <Form method="post">
          <button
            name="intent"
            value="delete"
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Delete
          </button>
        </Form>
      </div>
    </section>
  );
};
