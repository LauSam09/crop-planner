import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { Link, useLoaderData, useParams } from "@remix-run/react";

import SowingDetails from "~/components/SowingDetails";
import { fetchCrop } from "~/data/crops";
import { requireUserSession } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request, params }: ActionArgs) => {
  const user = await requireUserSession(request);
  const data = await fetchCrop(user.uid, params.cropId!);

  return json({ data });
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
            <Link to={`/crops/${cropId}/sowings/${sowing.id}`} key={sowing.id}>
              <SowingDetails
                number={data.sowings.length - i}
                currentStage={sowing.currentStage}
                date={new Date(sowing.stages[sowing.currentStage]!.date!)}
              />
            </Link>
          ))}
        </ul>
      ) : (
        <div>No sowings yet</div>
      )}
    </div>
  );
};

export default CropDetails;
