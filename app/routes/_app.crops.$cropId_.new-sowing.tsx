import { json, type ActionArgs } from "@remix-run/node";
import { Form, type V2_MetaFunction } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const stage = body.get("stage");
  const date = body.get("date");

  console.log({
    stage,
    date,
  });

  return json({});
}

export default function NewSowing() {
  return (
    <div className="mx-auto max-w-xs">
      <h2 className="mb-2 text-lg">New sowing</h2>
      <Form method="post" className="flex flex-col gap-2">
        <label className="flex flex-col gap-2">
          <span>Stage</span>
          <select name="stage" className="rounded p-1 dark:bg-gray-800">
            <option value="planning">Planning</option>
          </select>
        </label>
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
}
