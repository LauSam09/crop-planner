import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, type MetaFunction } from "@remix-run/react";

import { addCrop } from "~/data/crops";
import { requireUserSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

const validateName = (name: FormDataEntryValue | null) => {
  if (!name) {
    return "Name is required";
  }

  if (typeof name !== "string") {
    return "Invalid input";
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const name = body.get("name");

  const errors = {
    name: validateName(name),
    errors: {},
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, values: { name } });
  }

  const user = await requireUserSession(request);
  const cropId = await addCrop(user.uid, { name: name as string });

  return redirect(`/crops/${cropId}`);
};

const NewCrop = () => {
  const actionData = useActionData<typeof action>();

  return (
    <div className="mx-auto max-w-xs">
      <h2 className="mb-2 text-lg">New crop</h2>
      <Form method="post" className="flex flex-col gap-2">
        {actionData?.errors.name && (
          <p
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-500"
          >
            {actionData.errors.name}
          </p>
        )}
        <label className="flex flex-col gap-2">
          Name
          <input
            name="name"
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

export default NewCrop;
