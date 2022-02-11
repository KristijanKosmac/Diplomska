export default function CreateUserValidation(data: {email: string}) {
  let email = ""

  if (!data.email) {
    email = "Field email is required";
  }

  return {
    errors: {
      email,
    },
    valid: !email
  };
}
