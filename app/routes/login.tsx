import { FirebaseError } from "@firebase/app";
import { Form, Link, useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { signIn } from "~/utils/firebase.server";
import { createUserSession } from "~/utils/session.server";
import { validateEmail, validatePassword } from "~/utils/validation.server";

export let action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, values: { email } });
  }

  let user;

  try {
    const result = await signIn(email as string, password as string);
    user = result.user;
  } catch (err) {
    if (err instanceof FirebaseError) {
      let message: string;
      switch (err.code) {
        case "auth/wrong-password":
        case "auth/user-not-found":
          message = "Invalid email address or password.";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Reset your password to continue.";
          break;
        default:
          throw err;
      }

      return json({ errors: { form: message }, values: { email } });
    }

    throw err;
  }

  const token = await user.getIdToken();

  return createUserSession(token, "/");
};

export default function Login() {
  // TODO: Add type
  const actionData = useActionData();

  return (
    <div className="login">
      <h1>Login Page</h1>

      <Form method="post">
        {actionData?.errors.form ? (
          <p style={{ color: "red" }}>{actionData.errors.form}</p>
        ) : null}
        <p>
          <label>
            Email
            <input
              type="email"
              name="email"
              defaultValue={actionData?.values.email}
            />
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
        <button type="submit">Login</button>
      </Form>

      <Link to="/signup">Create Account</Link>
    </div>
  );
}
