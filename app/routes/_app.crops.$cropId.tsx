import type { V2_MetaFunction } from "@remix-run/react";
import { useParams } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export default function CropDetails() {
  const params = useParams();

  return <div>Crop {params.cropId}</div>;
}
