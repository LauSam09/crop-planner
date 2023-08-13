import type { V2_MetaFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";

// TODO: Check if signed in here

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export default function Index() {
  return <Outlet />;
}
