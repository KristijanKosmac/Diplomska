import { PatientValidationProps } from "../../types";

export default function patientValidation(data: PatientValidationProps) {
  let firstName = "",
    lastName = "",
    EMBG = "",
    dateOfBirth = "",
    email = "",
    familyDoctor = "";
  const emailRegex = /\S+@\S+\.\S+/;

  if (!data.firstName) {
    firstName = "Field first name is required";
  }
  if (!data.lastName) {
    lastName = "Field last name is required";
  }
  if (!data.EMBG) {
    EMBG = "Field EMBG number is required";
  }
  if (!data.dateOfBirth) {
    dateOfBirth = "Your date of birht is required";
  }
  if (data.email.length > 100 || !emailRegex.test(data.email)) {
    email = "Your email is not valid";
  }
  if (!data.familyDoctor) {
    familyDoctor = "Your family doctor is required";
  }

  return {
    errors: {
      firstName,
      lastName,
      EMBG,
      dateOfBirth,
      email,
      familyDoctor,
    },
    valid:
      !firstName &&
      !lastName &&
      !EMBG &&
      !dateOfBirth &&
      !email &&
      !familyDoctor,
  };
}
