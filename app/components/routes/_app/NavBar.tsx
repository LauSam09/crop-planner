import { useState } from "react";
import { Link, Form } from "@remix-run/react";
import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

import { ToggleButton } from "./ToggleButton";

export type NavBarProps = {
  email: string | undefined;
  onClickToggle: () => void;
};

export const NavBar = ({
  email,
  onClickToggle: toggleMobileSidebarOpen,
}: NavBarProps) => {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    placement: "bottom-end",
    onOpenChange: setOpen,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
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
          <div
            ref={refs.setReference}
            {...getReferenceProps()}
            className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
          >
            <svg
              className="absolute -left-1 h-12 w-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          {open && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-10 w-fit max-w-[14rem] divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
            >
              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div className="truncate font-medium">{email}</div>
              </div>

              <div className="py-1">
                <Form method="post">
                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                    Sign out
                  </button>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
