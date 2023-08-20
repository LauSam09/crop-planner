export type MainProps = {
  children?: React.ReactNode;
};

export const Main = ({ children }: MainProps) => (
  <main className="mt-14 p-4 dark:bg-gray-900 sm:ml-64">{children}</main>
);
