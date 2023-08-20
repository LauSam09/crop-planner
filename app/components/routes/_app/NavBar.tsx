import { Link, Form } from "@remix-run/react";
import { Dropdown, Avatar } from "flowbite-react";

import { ToggleButton } from "./ToggleButton";

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
        <Form method="post">
          <Dropdown
            inline
            label={<Avatar alt="User settings" rounded />}
            arrowIcon={false}
          >
            {email && (
              <Dropdown.Header>
                <span className="block truncate text-sm font-medium">
                  {email}
                </span>
              </Dropdown.Header>
            )}
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
);
