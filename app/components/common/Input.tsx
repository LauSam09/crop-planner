type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input = (props: InputProps) => (
  <input
    className="mt-1 block w-full rounded-md border px-2 py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 dark:border-gray-700 dark:text-white sm:text-sm sm:leading-6"
    {...props}
  />
);
