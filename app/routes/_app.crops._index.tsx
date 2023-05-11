import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

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
            date: "2023-05-20T09:00:00Z",
          },
        },
      },
      {
        created: "2023-01-01T09:00:00Z",
        currentStage: "planning",
        stages: {
          planning: {
            date: "2023-05-27T09:00:00Z",
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
            date: "2023-05-27T09:00:00Z",
          },
        },
      },
    ],
  };

  return json({
    data: [carrots, potatoes],
  });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-3 p-2">
      {data.map((crop) => (
        <div
          key={crop.id}
          className="rounded border border-gray-200 p-2 text-center"
        >
          <p>{crop.name}</p>
          {crop.sowings.length === 0 ? (
            <p>No sowings yet</p>
          ) : (
            <div className="mt-2 space-y-2">
              {crop.sowings.map((_, index) => (
                <div
                  key={index}
                  className="rounded border border-blue-500 bg-blue-500/40 p-1 text-center"
                >
                  Sow in 3 weeks
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
