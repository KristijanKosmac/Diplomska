import { DoctorValidation } from "../../types";

export default function doctorValidation(data: DoctorValidation) {
  let firstName = "",
    lastName = "",
    email = "",
    EMBG = "",
    dateOfBirth = ""

  if (!data.firstName) {
    firstName = "Field first name is required";
  }
  if (!data.lastName) {
    lastName = "Field last name is required";
  }
  if (!data.email) {
    email = "Field email is required";
  }
  if (!data.EMBG) {
    EMBG = "Field EMBG is required";
  }
  if (!data.dateOfBirth) {
    dateOfBirth = "Field dateOfBirth is required";
  }
  return {
    errors: {
      firstName,
      lastName,
      email,
      EMBG,
      dateOfBirth,
    },
    valid: !firstName && !lastName && !email && !EMBG && !dateOfBirth,
  };
}
