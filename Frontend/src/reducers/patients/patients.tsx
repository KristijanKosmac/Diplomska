import { PatientsState } from "../../types";
import { PatientsActionTypes } from "../../constants/index";

const INITIAL_STATE: PatientsState = {
  patients: [],
  isLoading: false,
  errorMessage: "",
  successMessage: "",
};

const patientsReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case PatientsActionTypes.FETCH_PATIENTS_SUCCESS_START:
      return {
        ...state,
        isLoading: true
      };
    case PatientsActionTypes.FETCH_PATIENTS_SUCCESS:
      return {
        ...state,
        patients: action.payload.patients,
        successMessage: action.payload.successMessage,
        isLoading: false
      };
    case PatientsActionTypes.FETCH_PATIENTS_FAIL:
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
        isLoading: false
      }
    case PatientsActionTypes.CREATE_PATIENT_SUCCESS:
      return {
        ...state,
        successMessage: action.payload.successMessage,
        patients: action.payload.patients,
      }
    case PatientsActionTypes.CREATE_PATIENT_FAIL:
      return {
        ...state,
        errorMessage: action.payload.errorMessage
      }
    case PatientsActionTypes.UPDATE_PATIENT_SUCCESS:
      return {
        ...state,
        successMessage: action.payload.successMessage,
        patients: action.payload.patients,
      }
    case PatientsActionTypes.UPDATE_PATIENT_FAIL:
      return {
        ...state,
        errorMessage: action.payload.errorMessage
      }
    case PatientsActionTypes.DELETE_PATIENT_SUCCESS:
      return {
        ...state,
        successMessage: action.payload.successMessage,
        patients: action.payload.patients,
      }
    case PatientsActionTypes.DELETE_PATIENT_FAIL:
      return {
        ...state,
        errorMessage: action.payload.errorMessage
      }
    case PatientsActionTypes.RESET_MESSAGES:
      return {
        ...state,
        successMessage: "",
        errorMessage: ""
      }
    default:
      return state;
  }
};

export default patientsReducer;
