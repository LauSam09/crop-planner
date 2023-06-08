import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

import { Sowing } from "~/components/Sowing";
import { fetchCrops } from "~/data/crops";
import { getUserSession } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUserSession(request);
  const data = await fetchCrops(user!.uid);

  return json({
    data,
  });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  if (data.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-3 p-2">
        Looks like you don't have any crops yet
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-3 p-2">
      {data.map((crop) => (
        <Link key={crop.id} to={`/crops/${crop.id}`}>
          <div className="rounded border border-gray-200 p-2 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-lg">{crop.name}</p>
            {crop.sowings.length === 0 ? (
              <p>No sowings yet</p>
            ) : (
              <div className="mt-2 space-y-2">
                {crop.sowings.map((sowing, index) => (
                  <Sowing
                    key={index}
                    currentStage={sowing.currentStage}
                    stages={sowing.stages}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
