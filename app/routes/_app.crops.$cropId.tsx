import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { differenceInWeeks, format, isFuture } from "date-fns";

import { fetchCrop } from "~/data/crops";
import type { Stage } from "~/models/crop";
import { getUserSession } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request, params }: ActionArgs) => {
  const user = await getUserSession(request);

  if (!user) {
    return redirect("/login");
  }

  const data = await fetchCrop(user!.uid, params.cropId!);

  return json({ data });
};

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

export default function CropDetails() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-2">
      <h1 className="text-xl">{data.name}</h1>
      <h2 className="text-lg">Sowings</h2>
      {data.sowings.length > 0 ? (
        <ul>
          {data.sowings.map((sowing, i) => (
            <SowingDetails
              key={i}
              number={data.sowings.length - i}
              currentStage={sowing.currentStage}
              date={new Date(sowing.stages[sowing.currentStage]?.date!)}
            />
          ))}
        </ul>
      ) : (
        <div>No sowings yet</div>
      )}
    </div>
  );
}
