import { useState } from "react";
import { Link, Outlet } from "@remix-run/react";
import classNames from "classnames";

export default function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebarOpen = () =>
    setMobileSidebarOpen((previous) => !previous);

  const closeMobileSideBar = () => setMobileSidebarOpen(false);

  return (
    <>
      <>
        <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="p-3">
            <div className="flex items-center justify-start gap-2">
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
                  onClick={closeMobileSideBar}
                  className="flex rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/crops"
                  onClick={closeMobileSideBar}
                  className="flex rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Crops
                </Link>
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
      <div className="mt-14 p-4 dark:bg-gray-900 sm:ml-64">
        <Outlet />
      </div>
    </>
  );
}
