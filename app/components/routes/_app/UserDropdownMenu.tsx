import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";
import { Form } from "@remix-run/react";
import { useState } from "react";

export type UserDropdownMenuProps = {
  email: string | undefined;
};

export const UserDropdownMenu = ({ email }: UserDropdownMenuProps) => {
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
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
      >
        <AvatarIcon />
      </div>
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-10 w-fit max-w-[14rem] divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
        >
          {email && (
            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div className="truncate font-medium">{email}</div>
            </div>
          )}

          <div className="py-1">
            <Form method="post">
              <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                Sign out
              </button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

const AvatarIcon = () => (
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
);
