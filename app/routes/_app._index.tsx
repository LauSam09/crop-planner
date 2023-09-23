import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";

import { requireUserSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserSession(request);

  return redirect("/crops");
};

const Index = () => {
  return (
    <div className="flex justify-center">
      <div className="rounded-lg p-4">
        <h1 className="mb-4 text-center text-2xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
          Welcome
        </h1>
      </div>
    </div>
  );
};

export default Index;
