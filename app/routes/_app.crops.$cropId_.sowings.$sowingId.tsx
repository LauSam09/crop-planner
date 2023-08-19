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

import { deleteSowing, fetchCrop } from "~/data/crops";
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

  await deleteSowing(user.uid, cropId!, +sowingId!);

  return redirect(`/crops/${cropId}`);
};

const formatStage = (stage: Stage) => {
  switch (stage) {
    case "planning":
      return "Planned";
    case "growing":
      return "Growing";
    case "storing":
      return "Storing";
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
  const orderedStages = Object.entries(stages).reverse();

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
    <div className="mx-auto max-w-md">
      <section>
        <h2>Actions</h2>
        <div className="flex justify-end gap-2">
          {hasNextStage && (
            <button className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
              {formStageImperative(nextStage as Stage)}
            </button>
          )}
          <Form method="post">
            <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
              Delete
            </button>
          </Form>
        </div>
      </section>
      <section>
        <h2>Stages</h2>
        <div className="flex flex-col gap-2">
          {orderedStages.map(([stage, values]) => (
            <div
              key={stage}
              className={classNames("flex flex-col", {
                "font-bold": stage === currentStage,
              })}
            >
              <span>{formatStage(stage as Stage)}</span>
              <span>{format(new Date(values.date), "dd/MM/yy")}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SowingDetails;
