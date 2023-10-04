export type ErrorProps = {
  children?: React.ReactNode;
};

export const Error = (props: ErrorProps) => (
  <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-500">
    {props.children}
  </p>
);
