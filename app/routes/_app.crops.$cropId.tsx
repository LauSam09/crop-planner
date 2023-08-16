import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { isBefore, isSameDay } from "date-fns";

import SowingDetails from "~/components/SowingDetails";
import { fetchCrop } from "~/data/crops";
import type { Sowing } from "~/models/crop";
import { requireUserSession } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request, params }: ActionArgs) => {
  const user = await requireUserSession(request);

  const data = await fetchCrop(user.uid, params.cropId!);

  data.sowings = data.sowings.map((s, index) => ({ ...s, index }));
  data.sowings.sort(compareSowings);

  return json({ data });
};

const compareSowingDate = (sowingA: Sowing, sowingB: Sowing) => {
  const sowingADate = sowingA.stages[sowingA.currentStage]!.date;
  const sowingBDate = sowingB.stages[sowingB.currentStage]!.date;

  if (isSameDay(sowingADate, sowingBDate)) {
    return 0;
  } else if (isBefore(sowingADate, sowingBDate)) {
    return 1;
  }

  return -1;
};

const compareSowings = (sowingA: Sowing, sowingB: Sowing) => {
  switch (sowingA.currentStage) {
    case "planning":
      switch (sowingB.currentStage) {
        case "planning":
          return compareSowingDate(sowingA, sowingB);
        case "growing":
        case "storing":
          return -1;
      }
    case "growing":
      switch (sowingB.currentStage) {
        case "planning":
          return 1;
        case "growing":
          return compareSowingDate(sowingA, sowingB);
        case "storing":
          return -1;
      }
    case "storing":
      switch (sowingB.currentStage) {
        case "planning":
        case "growing":
          return 1;
        case "storing":
          return compareSowingDate(sowingA, sowingB);
      }
  }
};

const CropDetails = () => {
  const { data } = useLoaderData<typeof loader>();
  const { cropId } = useParams();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-2">
      <h1 className="text-xl">{data.name}</h1>
      <div className="flex justify-between">
        <h2 className="text-lg">Sowings</h2>
        <Link to={`/crops/${cropId}/new-sowing`}>New</Link>
      </div>
      {data.sowings.length > 0 ? (
        <ul>
          {data.sowings.map((sowing, i) => (
            <SowingDetails
              key={i}
              number={data.sowings.length - i}
              currentStage={sowing.currentStage}
              date={new Date(sowing.stages[sowing.currentStage]!.date!)}
            />
          ))}
        </ul>
      ) : (
        <div>No sowings yet</div>
      )}
    </div>
  );
};

export default CropDetails;
