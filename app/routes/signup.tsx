import { Form, useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { FirebaseError } from "@firebase/app";

import { signUp } from "~/utils/firebase.server";
import { createUserSession } from "~/utils/session.server";
import {
  validateEmail,
  validatePasswordRequirements,
} from "~/utils/validation.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = {
    email: validateEmail(email),
    password: validatePasswordRequirements(password),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, values: { email } });
  }

  let user;

  try {
    const result = await signUp(email as string, password as string);
    user = result.user;
  } catch (err) {
    if (err instanceof FirebaseError) {
      let message: string;
      switch (err.code) {
        case "auth/email-already-in-use":
          message = "Email already in use";
          break;
        default:
          throw err;
      }

      return json({ errors: { form: message }, values: { email } });
    }

    throw err;
  }

  const token = await user.getIdToken();

  return await createUserSession(token, "/");
};

export default function SignUp() {
  // TODO: Add type
  const actionData = useActionData();

  return (
    <div>
      <h1>Sign Up Page</h1>
      <Form method="post">
        {actionData?.errors.form ? (
          <p style={{ color: "red" }}>{actionData.errors.form}</p>
        ) : null}
        <p>
          <label>
            Email
            <input type="email" name="email" />
          </label>
        </p>
        {actionData?.errors.email ? (
          <p style={{ color: "red" }}>{actionData.errors.email}</p>
        ) : null}
        <p>
          <label>
            Password
            <input type="password" name="password" />
          </label>
        </p>
        {actionData?.errors.password ? (
          <p style={{ color: "red" }}>{actionData.errors.password}</p>
        ) : null}
        <button>Sign up</button>
      </Form>
    </div>
  );
}
