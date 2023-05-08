import type { V2_MetaFunction } from "@remix-run/react";
import { Link } from "@remix-run/react";
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
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="p-3">
          <Link to="/">
            <span className="whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl">
              Crop Planner
            </span>
          </Link>
        </div>
      </nav>

      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white pt-20 dark:border-gray-700 dark:bg-gray-800">
        <div className="h-full overflow-y-auto px-3 pb-4 ">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/"
                className="flex rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/crops"
                className="flex rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Crops
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="ml-64 min-h-screen p-4 dark:bg-gray-900">
        <div className="mt-14">
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
        </div>
      </div>
    </>
  );
}
