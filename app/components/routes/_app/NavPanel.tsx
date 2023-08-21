import { NavLink } from "@remix-run/react";
import classNames from "classnames";

export type NavPanelProps = {
  mobileSidebarOpen: boolean;
  onClickLink: () => void;
};

export const NavPanel = ({
  mobileSidebarOpen,
  onClickLink: closeMobileSidebar,
}: NavPanelProps) => (
  <>
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
              to="/crops"
              onClick={closeMobileSidebar}
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
      onClick={closeMobileSidebar}
      className={classNames(
        "absolute z-30 h-full w-full bg-gray-900/50 sm:hidden cursor-pointer",
        { hidden: !mobileSidebarOpen }
      )}
    >
      <span className="sr-only">Sidebar backdrop</span>
    </div>
  </>
);
