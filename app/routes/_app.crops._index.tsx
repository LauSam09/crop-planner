import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Sowing } from "~/components/Sowing";

import type { Crop } from "~/models/crop";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = () => {
  const carrots: Crop = {
    id: "1",
    name: "Carrots",
    created: "2023-01-01T09:00:00Z",
    sowings: [
      {
        created: "2023-01-01T09:00:00Z",
        currentStage: "planning",
        stages: {
          planning: {
            date: "2023-06-03T09:00:00Z",
          },
        },
      },
      {
        created: "2023-01-01T09:00:00Z",
        currentStage: "growing",
        stages: {
          planning: {
            date: "2023-05-27T09:00:00Z",
          },
          growing: {
            date: "2023-05-27T09:00:00Z",
          },
        },
      },
      {
        created: "2023-01-01T09:00:00Z",
        currentStage: "storing",
        stages: {
          planning: {
            date: "2023-04-23T09:00:00Z",
          },
          growing: {
            date: "2023-04-23T09:00:00Z",
          },
          storing: {
            date: "2023-05-30T09:00:00Z",
          },
        },
      },
    ],
  };

  const potatoes: Crop = {
    id: "2",
    name: "Potatoes",
    created: "2023-01-01T09:00:00Z",
    sowings: [
      {
        created: "2023-01-01T09:00:00Z",
        currentStage: "planning",
        stages: {
          planning: {
            date: "2023-06-03T09:00:00Z",
          },
        },
      },
    ],
  };

  const cauliflower: Crop = {
    id: "3",
    name: "Cauliflower",
    created: "2023-01-01T09:00:00Z",
    sowings: [],
  };

  return json({
    data: [carrots, potatoes, cauliflower],
  });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-lg space-y-3 p-2  ">
      {data.map((crop) => (
        <div
          key={crop.id}
          className="rounded border border-gray-200 p-2 text-center dark:border-gray-700 dark:bg-gray-800"
        >
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
      ))}
    </div>
  );
}
