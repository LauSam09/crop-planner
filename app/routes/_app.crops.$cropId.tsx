import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

import { fetchCrop } from "~/data/crops";
import { getUserSession } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request, params }: ActionArgs) => {
  const user = await getUserSession(request);
  const data = await fetchCrop(user!.uid, params.cropId!);

  return json({ data });
};

function PlantStage() {
  return (
    <div className="rounded border border-green-500 bg-green-500/40 p-2">
      02/04/22
    </div>
  );
}

function HarvestStage() {
  return (
    <div className="rounded border border-orange-500 bg-orange-500/40 p-2">
      23/04/22
    </div>
  );
}

function SowingMenu() {
  return (
    <button className="rounded border">
      <svg
        height="20px"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
      >
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
      </svg>
    </button>
  );
}

function Sowing() {
  return (
    <div className="mb-2 flex gap-2">
      <PlantStage />
      <HarvestStage />
      <SowingMenu />
    </div>
  );
}

export default function CropDetails() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div>
      <div>{data.name}</div>
      <h2>Sowings</h2>
      {data.sowings.length > 0 ? (
        <ul>
          {data.sowings.map((sowing, key) => (
            <Sowing key={key} />
          ))}
        </ul>
      ) : (
        <div>No sowings yet</div>
      )}
    </div>
  );
}
