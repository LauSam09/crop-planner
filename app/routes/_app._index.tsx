import {
  redirect,
  type ActionArgs,
  type LoaderArgs,
  json,
} from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { Form } from "@remix-run/react";

import { getUserSession, signOut } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const action = ({ request }: ActionArgs) => {
  return signOut(request);
};

export async function loader({ request }: LoaderArgs) {
  // TODO: https://remix.run/docs/en/1.19.3/pages/faq#how-can-i-have-a-parent-route-loader-validate-the-user-and-protect-all-child-routes
  const user = await getUserSession(request);

  if (!user) {
    return redirect("/login");
  }

  return json({});
}

export default function Index() {
  return (
    <div className="flex justify-center">
      <div className="rounded-lg p-4 dark:bg-gray-800">
        <h1 className="mb-4 text-center text-2xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
          Welcome to Crop Planner
        </h1>
        <Form method="post" className="mt-8 text-center">
          <button
            type="submit"
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Sign out
          </button>
        </Form>
      </div>
    </div>
  );
}
