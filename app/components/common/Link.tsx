import { Link as RemixLink } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import { forwardRef } from "react";

export type LinkProps = React.ForwardRefExoticComponent<
  RemixLinkProps & React.RefAttributes<HTMLAnchorElement>
>;

export const Link = forwardRef<HTMLAnchorElement, RemixLinkProps>(
  function Link(props, ref) {
    return (
      <RemixLink
        ref={ref}
        {...props}
        className="rounded-md px-3 py-[6px] font-medium text-green-600 hover:underline focus-visible:outline focus-visible:outline-2 dark:text-green-500"
      />
    );
  }
);
Link.displayName = "Link";
