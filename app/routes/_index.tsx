import type { V2_MetaFunction } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { getUserSession, signOut } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Crop Planner" }];
};

export const action = ({ request }: ActionArgs) => {
  return signOut(request);
};

export const loader = async ({ request }: LoaderArgs) => {
  console.log("Executing loader for /");
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect("/login");
  }

  return null;
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <Form method="post">
        <button type="submit">Sign out</button>
      </Form>
    </div>
  );
}
