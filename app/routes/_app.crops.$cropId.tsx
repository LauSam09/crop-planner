import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

import { fetchCrop } from "~/data/crops";
import { getUserSession } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request, params }: ActionArgs) => {
  const user = await getUserSession(request);
  const data = await fetchCrop(user!.uid, params.cropId!);

  return json({ data });
};

export default function CropDetails() {
  const { data } = useLoaderData<typeof loader>();

  return <div>{data.name}</div>;
}
