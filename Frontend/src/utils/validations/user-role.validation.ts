import { User } from "../../types";

export default function UserValidation(data: User) {
  let firstName = "",
    lastName = "",
    email = "",
    institution = "",
    role = "";

  if (!data.firstName) {
    firstName = "Field first name is required";
  }
  if (!data.lastName) {
    lastName = "Field last name is required";
  }
  if (!data.email) {
    email = "Field email is required";
  }
  if (!data.institution) {
    institution = "Field institution is required";
  }
  if (!data.role) {
    role = "Field role is required";
  }
  return {
    errors: {
      firstName,
      lastName,
      email,
      institution,
      role,
    },
    valid: !firstName && !lastName && !email && !institution && !role,
  };
}
