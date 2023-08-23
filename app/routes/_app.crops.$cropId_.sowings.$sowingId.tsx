import {
  json,
  type ActionArgs,
  type V2_MetaFunction,
  type LoaderArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { format } from "date-fns";

import { deleteSowing, fetchCrop, progressCrop } from "~/data/crops";
import type { Stage } from "~/models/crop";
import { requireUserSession } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUserSession(request);
  const data = await fetchCrop(user.uid, params.cropId!);

  const sowing = data.sowings.find((s) => s.id === +params.sowingId!);

  if (!sowing) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  return json(sowing);
};

export const action = async ({
  request,
  params: { cropId, sowingId },
}: ActionArgs) => {
  const user = await requireUserSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "delete":
      await deleteSowing(user.uid, cropId!, +sowingId!);
      return redirect(`/crops/${cropId}`);
    case "progress":
      await progressCrop(user.uid, cropId!, +sowingId!);
      return null;
    default:
      throw new Error("Unexpected action");
  }
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

const SowingDetails = () => {
  const { currentStage, stages } = useLoaderData<typeof loader>();

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

  const currentStageValues = stages[currentStage];
  const previousStages = Object.entries(stages)
    .filter(([stage]) => stage !== currentStage && stage !== "planning")
    .reverse();

  return (
    <div className="mx-auto max-w-md space-y-2">
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
      <section className="space-y-1">
        <h2>Current Stage</h2>
        <div
          className={classNames("flex flex-col rounded p-2", {
            "border-blue-500 bg-blue-500/40": currentStage === "planning",
            "border-green-500 bg-green-500/40": currentStage === "growing",
            "border-orange-500 bg-orange-500/40": currentStage === "storing",
          })}
        >
          <span>
            {formatStage(currentStage)}{" "}
            {format(new Date(currentStageValues!.date), "dd/MM/yy")}
          </span>
        </div>
      </section>
      {previousStages.length > 0 && (
        <section className="space-y-1">
          <h2>Previous stages</h2>
          <div className="flex flex-col gap-2">
            {previousStages.map(([stage, values]) => (
              <div
                key={stage}
                className={classNames("flex flex-col rounded p-2", {
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
      )}
    </div>
  );
};

export default SowingDetails;
