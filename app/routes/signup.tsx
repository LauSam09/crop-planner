﻿import { Form, Link, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { FirebaseError } from "@firebase/app";

import { signUp } from "~/utils/firebase.server";
import { createUserSession } from "~/utils/session.server";
import {
  validateEmail,
  validatePasswordRequirements,
} from "~/utils/validation.server";

export const meta: MetaFunction = () => {
  return [{ title: "Sign up | Crop Planner" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = {
    email: validateEmail(email),
    password: validatePasswordRequirements(password),
    form: false,
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

      return json({ errors: { ...errors, form: message }, values: { email } });
    }

    throw err;
  }

  const token = await user.getIdToken();

  return await createUserSession(token, "/");
};

const SignUp = () => {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex h-screen items-center justify-center dark:bg-gray-900">
      <div className="w-80 rounded p-4 dark:bg-gray-800">
        <h1 className="text-base font-semibold leading-7">Sign up</h1>
        <Form method="post">
          {actionData?.errors.form ? (
            <p
              role="alert"
              className="mt-1 text-sm text-red-600 dark:text-red-500"
            >
              {actionData.errors.form}
            </p>
          ) : null}
          <p>
            <label className="block text-sm font-medium leading-6 ">
              Email address
              <input
                type="email"
                name="email"
                className="mt-1 block w-full rounded-md border px-2 py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              />
            </label>
          </p>
          {actionData?.errors.email ? (
            <p
              role="alert"
              className="mt-1 text-sm text-red-600 dark:text-red-500"
            >
              {actionData.errors.email}
            </p>
          ) : null}
          <p>
            <label className="mt-2 block text-sm font-medium leading-6">
              Password
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                className="mt-1 block w-full rounded-md border px-2 py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              />
            </label>
          </p>
          {actionData?.errors.password ? (
            <p
              role="alert"
              className="mt-1 text-sm text-red-600 dark:text-red-500"
            >
              {actionData.errors.password}
            </p>
          ) : null}
          <div className="mt-2 flex w-full items-center justify-end">
            <Link
              to="/login"
              className="rounded-md px-3 py-[6px] font-medium text-green-600 hover:underline focus-visible:outline focus-visible:outline-2 dark:text-green-500"
            >
              Log in
            </Link>
            <button
              type="submit"
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Sign up
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
