import type { V2_MetaFunction } from "@remix-run/react";
import { Link } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useState } from "react";
import classNames from "classnames";

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="p-3">
          <div className="flex items-center justify-start gap-2">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              onClick={() => setMobileSidebarOpen((previous) => !previous)}
              className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <Link to="/">
              <span className="whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl">
                Crop Planner
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <aside
        className={classNames(
          "fixed left-0 top-0 h-screen w-64 border-r z-40 border-gray-200 bg-white pt-20 transition-transform dark:border-gray-700 dark:bg-gray-800 sm:translate-x-0",
          {
            "-translate-x-full": !mobileSidebarOpen,
          }
        )}
      >
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
      <div
        onClick={() => setMobileSidebarOpen(false)}
        className={classNames(
          "absolute z-30 h-full w-full bg-gray-900/50 sm:hidden cursor-pointer",
          { hidden: !mobileSidebarOpen }
        )}
      >
        <span className="sr-only">Sidebar backdrop</span>
      </div>

      <div className="min-h-screen p-4 dark:bg-gray-900 sm:ml-64">
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
