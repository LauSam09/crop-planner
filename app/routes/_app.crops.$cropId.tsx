import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";

import SowingDetails from "~/components/SowingDetails";
import { deleteCrop, fetchCrop } from "~/data/crops";
import { requireUserSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await requireUserSession(request);
  const data = await fetchCrop(user.uid, params.cropId!);

  return json({ data });
};

export const action = async ({
  request,
  params: { cropId },
}: ActionFunctionArgs) => {
  const user = await requireUserSession(request);

  await deleteCrop(user.uid, cropId!);

  return redirect("/crops");
};

const CropDetails = () => {
  const { data } = useLoaderData<typeof loader>();
  const { cropId } = useParams();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-2">
      <div className="flex justify-between">
        <h1 className="text-xl">{data.name}</h1>
        <div>
          <Form method="post">
            <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
              Delete
            </button>
          </Form>
        </div>
      </div>
      <div className="flex justify-between">
        <h2 className="text-lg">Sowings</h2>
        <Link
          to={`/crops/${cropId}/new-sowing`}
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Add sowing
        </Link>
      </div>
      {data.sowings.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {data.sowings.map((sowing, i) => (
            <Link to={`/crops/${cropId}/sowings/${sowing.id}`} key={sowing.id}>
              <SowingDetails
                currentStage={sowing.currentStage}
                date={new Date(sowing.stages[sowing.currentStage]!.date!)}
              />
            </Link>
          ))}
        </ul>
      ) : (
        <div>No sowings yet</div>
      )}
    </div>
  );
};

export default CropDetails;
