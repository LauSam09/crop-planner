import { useState } from "react";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { type LoaderArgs, json } from "@remix-run/node";
import { Avatar, Dropdown } from "flowbite-react";
import classNames from "classnames";
import { requireUserSession } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUserSession(request);

  return json({ email: user.email });
};

const Layout = () => {
  const data = useLoaderData<typeof loader>();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebarOpen = () =>
    setMobileSidebarOpen((previous) => !previous);

  const closeMobileSideBar = () => setMobileSidebarOpen(false);

  return (
    <>
      <>
        <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  data-drawer-target="logo-sidebar"
                  data-drawer-toggle="logo-sidebar"
                  aria-controls="logo-sidebar"
                  type="button"
                  onClick={toggleMobileSidebarOpen}
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
                      clipRule="evenodd"
                      fillRule="evenodd"
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
              <Form method="post">
                <Dropdown
                  inline
                  label={<Avatar alt="User settings" rounded />}
                  arrowIcon={false}
                >
                  <Dropdown.Header>
                    <span className="block truncate text-sm font-medium">
                      {data.email}
                    </span>
                  </Dropdown.Header>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                  >
                    Sign out
                  </button>
                </Dropdown>
              </Form>
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
                <NavLink
                  to="/"
                  onClick={closeMobileSideBar}
                  className={({ isActive }) =>
                    classNames(
                      "flex rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                      {
                        "bg-gray-100/80 dark:bg-gray-700/60": isActive,
                      }
                    )
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/crops"
                  onClick={closeMobileSideBar}
                  className={({ isActive }) =>
                    classNames(
                      "flex rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                      {
                        "bg-gray-100/80 dark:bg-gray-700/60": isActive,
                      }
                    )
                  }
                >
                  Crops
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>

        <div
          onClick={closeMobileSideBar}
          className={classNames(
            "absolute z-30 h-full w-full bg-gray-900/50 sm:hidden cursor-pointer",
            { hidden: !mobileSidebarOpen }
          )}
        >
          <span className="sr-only">Sidebar backdrop</span>
        </div>
      </>
      <main className="mt-14 p-4 dark:bg-gray-900 sm:ml-64">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
