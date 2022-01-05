import { ExaminationValidationProps } from "../../types";

export default function examinationValidation(data: ExaminationValidationProps) {
  let patientId = "",
    examinationType = ""

  if (!data.patientId) {
    patientId = "Field patientId is required";
  }
  if (!data.examinationType) {
    examinationType = "Field examination type is required";
  }
  return {
    errors: {
      patientId,
      examinationType,
    },
    valid: !patientId && !examinationType 
  };
}
