import { PatientValidationProps } from "../../types";

export default function patientValidation(data: PatientValidationProps) {
  let firstName = "",
    lastName = "",
    PET = "",
    telephoneNumber = "";

  if (!data.firstName) {
    firstName = "Field first name is required";
  }
  if (!data.lastName) {
    lastName = "Field last name is required";
  }
  if (!data.PET) {
    PET = "Field PAT number is required";
  }
  if (!data.telephoneNumber) {
    telephoneNumber = "Your telephone number is required";
  }

  return {
    errors: {
      firstName,
      lastName,
      PET,
      telephoneNumber,
    },
    valid: !firstName && !lastName && !PET && !telephoneNumber,
  };
}
