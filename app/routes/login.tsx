import { FirebaseError } from "@firebase/app";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { signIn } from "~/utils/firebase.server";
import { createUserSession } from "~/utils/session.server";
import { validateEmail, validatePassword } from "~/utils/validation.server";
import { Button, Error, Input, Label, Link } from "~/components";

export const meta: MetaFunction = () => {
  return [{ title: "Login | Crop Planner" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    form: false,
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
          message = "Invalid email address or password";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts - reset your password to continue";
          break;
        default:
          throw err;
      }

      return json({ errors: { ...errors, form: message }, values: { email } });
    }

    throw err;
  }

  const token = await user.getIdToken();

  return createUserSession(token, "/");
};

const Login = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/login";

  return (
    <div className="flex h-screen items-center justify-center dark:bg-gray-900">
      <div className="w-80 rounded p-4 dark:bg-gray-800">
        <h1 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
          Login
        </h1>

        <Form method="post" className="flex flex-col gap-2">
          {actionData?.errors.form && <Error>{actionData.errors.form}</Error>}
          <p>
            <Label>
              Email address
              <Input
                type="email"
                name="email"
                defaultValue={actionData?.values?.email?.toString() ?? ""}
              />
            </Label>
            {actionData?.errors.email && (
              <Error>{actionData.errors.email}</Error>
            )}
          </p>
          <p>
            <Label>
              Password
              <Input
                type="password"
                name="password"
                autoComplete="current-password"
              />
            </Label>
          </p>
          {actionData?.errors.password && (
            <Error>{actionData.errors.password}</Error>
          )}
          <div className="flex w-full items-center justify-end gap-2">
            <Link to="/signup">Create account</Link>
            <Button type="submit" disabled={isSubmitting}>
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
