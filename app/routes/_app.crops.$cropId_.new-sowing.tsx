import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, type MetaFunction } from "@remix-run/react";

import { addSowing } from "~/data/crops";
import { requireUserSession } from "~/utils/session.server";
import { validateDate, validateStage } from "~/utils/validation.server";

export const meta: MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserSession(request);

  return json({});
};

export const action = async ({
  request,
  params: { cropId },
}: ActionFunctionArgs) => {
  const body = await request.formData();
  const stage = body.get("stage");
  const date = body.get("date");

  const errors = {
    stage: validateStage(stage),
    date: validateDate(date),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, values: { stage, date } });
  }

  const user = await requireUserSession(request);

  await addSowing(user.uid, cropId!, {
    created: new Date(),
    currentStage: "planning",
    stages: { planning: { date: new Date(date as string) } },
  });

  return redirect(`/crops/${cropId}`);
};

const NewSowing = () => {
  const actionData = useActionData<typeof action>();

  return (
    <div className="mx-auto max-w-xs">
      <h2 className="mb-2 text-lg">New sowing</h2>
      <Form method="post" className="flex flex-col gap-2">
        {actionData?.errors.stage && (
          <p
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-500"
          >
            {actionData.errors.stage}
          </p>
        )}
        <label className="flex flex-col gap-2">
          <span>Stage</span>
          <select name="stage" className="rounded p-1 dark:bg-gray-800">
            <option value="planning">Planning</option>
          </select>
        </label>
        {actionData?.errors.date && (
          <p
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-500"
          >
            {actionData.errors.date}
          </p>
        )}
        <label className="flex flex-col gap-2">
          <span>Planned planting date</span>
          <input
            type="date"
            name="date"
            className="rounded border p-1 dark:border-0 dark:bg-gray-800"
          />
        </label>
        <div className="flex justify-end">
          <button className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            Save
          </button>
        </div>
      </Form>
    </div>
  );
};

export default NewSowing;
