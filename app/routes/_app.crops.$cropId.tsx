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

function PlannedIcon() {
  return (
    <svg
      height={20}
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      stroke="rgb(34 197 94 / 100)"
      fill="none"
      className="z-10"
    >
      <circle r={4} cx={5} cy={5} />
    </svg>
  );
}

function PlantedIcon() {
  return (
    <svg
      height={20}
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      stroke="rgb(34 197 94 / 100)"
      fill="rgb(34 197 94 / 100)"
      className="z-10"
    >
      <circle r={4} cx={5} cy={5} />
    </svg>
  );
}

function UnharvestedIcon() {
  return (
    <svg
      height={20}
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      stroke="rgb(249 115 22 / 100)"
      fill="none"
      className="z-10"
    >
      <circle r={4} cx={5} cy={5} />
    </svg>
  );
}

function HarvestedIcon() {
  return (
    <svg
      height={20}
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      stroke="rgb(249 115 22 / 100)"
      fill="rgb(249 115 22 / 100)"
      className="z-10"
    >
      <circle r={4} cx={5} cy={5} />
    </svg>
  );
}

function PlantStage(props: PlantStageProps) {
  const { planned, planted } = props;

  const date = planted ?? planned;

  return (
    <div className="flex flex-col items-stretch text-center">
      <div>{date.toLocaleDateString()}</div>
      <div className="relative flex justify-center">
        {planted ? <PlantedIcon /> : <PlannedIcon />}
        <span className="absolute left-[calc(50%+8px)] top-[calc(50%-1px)] w-[calc(50%-8px)] border-2 border-b border-gray-300 dark:border-gray-600" />
      </div>
    </div>
  );
}

interface HarvestStageProps {
  harvested: Date | undefined;
}

function HarvestStage(props: HarvestStageProps) {
  const { harvested } = props;

  const date = harvested ?? new Date();

  return (
    <div className="mr-2 flex flex-col items-stretch text-center">
      <div>{date.toLocaleDateString()}</div>
      <div className="relative flex justify-center">
        {harvested ? <HarvestedIcon /> : <UnharvestedIcon />}
        <span className="absolute left-[0] top-[calc(50%-1px)] w-[calc(50%-8px)] border-2 border-b border-gray-300 dark:border-gray-600"></span>
      </div>
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
        fill="currentColor"
        className="text-black dark:text-white"
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
    <div className="mb-2 flex">
      <div className="flex flex-1 pb-1">
        <PlantStage planned={planned} planted={planted} />
        <div className="flex flex-1 flex-col items-stretch">
          <div className="h-6" />
          <div className="relative h-5">
            <span className="absolute top-[calc(50%-1px)] w-full border-2 border-b border-gray-300 dark:border-gray-600" />
          </div>
        </div>
        <HarvestStage harvested={harvested} />
      </div>
      <SowingMenu />
    </div>
  );
}

export default function CropDetails() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-2">
      <h1 className="text-xl">{data.name}</h1>
      <h2 className="text-lg">Sowings</h2>
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
