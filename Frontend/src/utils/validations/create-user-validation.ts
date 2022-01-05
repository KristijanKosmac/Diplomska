export default function CreateUserValidation(data: {email: string, role: string}) {
  let email = "",
    role = "";

  if (!data.email) {
    email = "Field email is required";
  }
  if (!data.role) {
    role = "Field role is required";
  }
  return {
    errors: {
      email,
      role,
    },
    valid: !email  && !role,
  };
}
