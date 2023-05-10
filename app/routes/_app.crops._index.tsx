import type { V2_MetaFunction } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export default function Index() {
  return <div>Crops!</div>;
}
