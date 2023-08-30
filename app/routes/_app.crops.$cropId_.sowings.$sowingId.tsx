import {
  json,
  type ActionArgs,
  type V2_MetaFunction,
  type LoaderArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  Actions,
  CurrentStage,
  PreviousStages,
} from "~/components/routes/_app.crops.$cropId_.sowings.$sowingId";
import { deleteSowing, fetchCrop, progressCrop } from "~/data/crops";
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

const SowingDetails = () => {
  const { currentStage, stages } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-md space-y-2">
      <Actions currentStage={currentStage} />
      <CurrentStage
        currentStage={currentStage}
        date={new Date(stages[currentStage]!.date)}
      />
      <PreviousStages currentStage={currentStage} stages={stages} />
    </div>
  );
};

export default SowingDetails;
