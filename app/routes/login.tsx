import { FirebaseError } from "@firebase/app";
import { Form, Link, useActionData } from "@remix-run/react";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { signIn } from "~/utils/firebase.server";
import { createUserSession } from "~/utils/session.server";
import { validateEmail, validatePassword } from "~/utils/validation.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Login | Crop Planner" }];
};

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
    <div className="mx-auto max-w-md px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <h1 className="text-base font-semibold leading-7 text-gray-900">Login</h1>

      <Form method="post">
        {actionData?.errors.form ? (
          <p style={{ color: "red" }}>{actionData.errors.form}</p>
        ) : null}
        <p>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Email address
            <input
              type="email"
              name="email"
              defaultValue={actionData?.values.email}
              className="block w-full rounded-md border-0 py-1.5 px-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            />
          </label>
        </p>
        {actionData?.errors.email ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
            {actionData.errors.email}
          </p>
        ) : null}
        <p>
          <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
            Password
            <input
              type="password"
              name="password"
              className="block w-full rounded-md border-0 py-1.5 px-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            />
          </label>
        </p>
        {actionData?.errors.password ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
            {actionData.errors.password}
          </p>
        ) : null}
        <div className="flex justify-end items-center gap-2 w-full mt-2">
          <Link
            to="/signup"
            className="rounded-md px-3 py-[6px] font-medium text-green-600 dark:text-green-500 hover:underline focus-visible:outline focus-visible:outline-2"
          >
            Create Account
          </Link>
          <button
            type="submit"
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Login
          </button>
        </div>
      </Form>
    </div>
  );
}
