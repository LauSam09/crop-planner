import type { V2_MetaFunction } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { getUserSession, signOut } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const action = ({ request }: ActionArgs) => {
  return signOut(request);
};

export const loader = async ({ request }: LoaderArgs) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect("/login");
  }

  return null;
};

export default function Index() {
  return (
    <div className="max-w-lg mx-auto py-24">
      <h1 className="text-center mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        Welcome to Crop Planner
      </h1>
      <Form method="post" className="text-center mt-8">
        <button
          type="submit"
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Sign out
        </button>
      </Form>
    </div>
  );
}
