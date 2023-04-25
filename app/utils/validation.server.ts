export const validateEmail = (email: FormDataEntryValue | null) => {
  if (!email) {
    return "Email is required";
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
  password: FormDataEntryValue | null
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
