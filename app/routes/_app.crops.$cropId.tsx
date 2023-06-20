import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

import { fetchCrop } from "~/data/crops";
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

interface PlantStageProps {
  planned: Date;
  planted: Date | undefined;
}

function PlantStage(props: PlantStageProps) {
  const { planned, planted } = props;

  if (planted) {
    <div className="flex flex-1 justify-center gap-1 rounded border border-dashed border-green-500 bg-green-500/40 p-2 text-center">
      <span className="hidden sm:inline-block">Planted</span>
      <span>{planted.toLocaleDateString()}</span>
    </div>;
  }

  return (
    <div className="flex flex-1 justify-center gap-1 rounded border border-green-500 bg-green-500/40 p-2 text-center">
      <span className="hidden sm:inline-block">Planted</span>
      <span>{planned.toLocaleDateString()}</span>
    </div>
  );
}

interface HarvestStageProps {
  harvested: Date | undefined;
}

function HarvestStage(props: HarvestStageProps) {
  const { harvested } = props;

  if (!harvested) {
    return (
      <div className="flex flex-1 gap-1 rounded border border-dashed border-orange-500 bg-orange-500/40 p-2 text-center italic">
        <span className="hidden sm:inline-block">Harvest</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 gap-1 rounded border border-orange-500 bg-orange-500/40 p-2 text-center">
      <span className="hidden sm:inline-block">Harvested</span>
      <span>{harvested.toLocaleDateString()}</span>
    </div>
  );
}

function SowingMenu() {
  return (
    <button className="rounded border px-3">
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

interface SowingProps {
  planned: Date;
  planted: Date | undefined;
  harvested: Date | undefined;
}

function Sowing(props: SowingProps) {
  const { planned, planted, harvested } = props;

  return (
    <div className="mb-2 flex gap-2">
      <PlantStage planned={planned} planted={planted} />
      <HarvestStage harvested={harvested} />
      <SowingMenu />
    </div>
  );
}

export default function CropDetails() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-2">
      <div>{data.name}</div>
      <h2>Sowings</h2>
      {/* TODO: CSS Grid */}
      <div className="mb-2 flex gap-2 font-bold sm:hidden">
        <div className="flex-1 rounded border border-green-500 bg-green-500/40 p-2 text-center">
          Planted
        </div>
        <div className="flex-1 rounded border border-orange-500 bg-orange-500/40 p-2 text-center">
          Harvested
        </div>
        <div className="w-[46px]"></div>
      </div>
      {data.sowings.length > 0 ? (
        <ul>
          {data.sowings.map((sowing, key) => (
            <Sowing
              key={key}
              planned={new Date(sowing.stages.planning?.date!)}
              planted={
                sowing.stages.growing?.date
                  ? new Date(sowing.stages.growing?.date!)
                  : undefined
              }
              harvested={
                sowing.stages.storing?.date
                  ? new Date(sowing.stages.storing?.date!)
                  : undefined
              }
            />
          ))}
        </ul>
      ) : (
        <div>No sowings yet</div>
      )}
    </div>
  );
}
