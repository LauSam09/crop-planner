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
      <nav className="w-full bg-white z-50 fixed top-0 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <div className="p-3">
          <Link to="/">
            <span className="text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
              Crop Planner
            </span>
          </Link>
        </div>
      </nav>

      <aside className="fixed top-0 left-0 w-64 h-screen pt-20 border-r bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="h-full px-3 pb-4 overflow-y-auto ">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/"
                className="flex p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/crops"
                className="flex p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Crops
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 ml-64 min-h-screen dark:bg-gray-900">
        <div className="mt-14">
          <div className="flex justify-center">
            <div className="dark:bg-gray-800 p-4 rounded-lg">
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
          </div>
        </div>
      </div>
    </>
  );
}
