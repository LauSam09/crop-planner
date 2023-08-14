import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { Link, useLoaderData, useParams } from "@remix-run/react";

import SowingDetails from "~/components/SowingDetails";
import { fetchCrop } from "~/data/crops";
import { getUserSession } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request, params }: ActionArgs) => {
  // TODO: https://remix.run/docs/en/1.19.3/pages/faq#how-can-i-have-a-parent-route-loader-validate-the-user-and-protect-all-child-routes
  const user = await getUserSession(request);

  if (!user) {
    return redirect("/login");
  }

  const data = await fetchCrop(user!.uid, params.cropId!);

  return json({ data });
};

export default function CropDetails() {
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
}
