import type { Stage } from "~/models/crop";

export const validateEmail = (email: FormDataEntryValue | null) => {
  if (!email) {
    return "Email address is required";
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email address";
  }
};

export const validatePassword = (password: FormDataEntryValue | null) => {
  if (!password) {
    return "Password is required";
  }

  if (typeof password !== "string") {
    return "Invalid input";
  }
};

export const validatePasswordRequirements = (
  password: FormDataEntryValue | null,
) => {
  if (!password) {
    return "Password is required";
  }

  if (typeof password !== "string") {
    return "Invalid input";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
};

export const validateStage = (formStage: FormDataEntryValue | null) => {
  if (formStage !== ("planning" satisfies Stage)) {
    return "Stage must be 'planned'";
  }
};

export const validateDate = (formDate: FormDataEntryValue | null) => {
  if (!formDate) {
    return "Date is required";
  }

  if (
    typeof formDate != "string" ||
    new Date(formDate).toString() === "Invalid Date"
  ) {
    return "Date format is invalid";
  }
};
