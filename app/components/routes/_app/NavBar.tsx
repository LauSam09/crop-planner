import { Link } from "@remix-run/react";

import { ToggleButton } from "./ToggleButton";
import { UserDropdownMenu } from "./UserDropdownMenu";

export type NavBarProps = {
  email: string | undefined;
  onClickToggle: () => void;
};

export const NavBar = ({
  email,
  onClickToggle: toggleMobileSidebarOpen,
}: NavBarProps) => (
  <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <div className="px-5 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ToggleButton onClick={toggleMobileSidebarOpen} />
          <Link to="/">
            <span className="whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl">
              Crop Planner
            </span>
          </Link>
        </div>
        <UserDropdownMenu email={email} />
      </div>
    </div>
  </nav>
);
