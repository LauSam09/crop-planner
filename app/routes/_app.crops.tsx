import type { MetaFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

const Index = () => {
  return <Outlet />;
};

export default Index;
