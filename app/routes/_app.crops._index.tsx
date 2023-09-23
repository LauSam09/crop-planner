import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { Link, useLoaderData } from "@remix-run/react";
import SowingDetails from "~/components/SowingDetails";

import { fetchCrops } from "~/data/crops";
import { requireUserSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUserSession(request);
  const data = await fetchCrops(user!.uid);

  return json({
    data,
  });
};

const Index = () => {
  const { data } = useLoaderData<typeof loader>();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mx-auto max-w-lg space-y-3 p-2">
          Looks like you don't have any crops yet
        </div>
        <Link
          to="/crops/new"
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Add your first crop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 p-2">
      <div className="flex justify-end">
        <Link
          to="/crops/new"
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          New
        </Link>
      </div>
      {data.map((crop) => (
        <div key={crop.id}>
          <div className="rounded border border-gray-200 p-2 text-center dark:border-gray-700 dark:bg-gray-800">
            <Link
              to={`/crops/${crop.id}`}
              className="block w-full rounded p-1 text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {crop.name}
            </Link>
            {crop.sowings.length === 0 ? (
              <p>No sowings yet</p>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                {crop.sowings.map((sowing, index) => (
                  <Link
                    key={index}
                    to={`/crops/${crop.id}/sowings/${sowing.id}`}
                  >
                    <SowingDetails
                      currentStage={sowing.currentStage}
                      date={new Date(sowing.stages[sowing.currentStage]!.date!)}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Index;
