import { type LoaderArgs, json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";

import { requireUserSession } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserSession(request);

  return json({});
};

const Index = () => {
  return (
    <div className="flex justify-center">
      <div className="rounded-lg p-4 dark:bg-gray-800">
        <h1 className="mb-4 text-center text-2xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
          Welcome to Crop Planner
        </h1>
      </div>
    </div>
  );
};

export default Index;
