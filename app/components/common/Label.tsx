export type LabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export const Label = (props: LabelProps) => (
  <label
    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
    {...props}
  />
);
