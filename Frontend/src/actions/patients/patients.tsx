import { useSelector } from "react-redux";
import { History } from "history";
import { PatientsActionTypes } from "../../constants/index";
import { Patient, PatientPayload } from "../../types";
import { patientAPI } from "../../api";
import { GlobalState } from "../../reducers";

export const getAllPatients =
  (doctorId: string) =>
  async (
    dispatch: (arg0: { type: string; payload: PatientPayload }) => void
  ) => {
    dispatch({
      type: PatientsActionTypes.FETCH_PATIENTS_SUCCESS_START,
      payload: {}
    });

    try {
      const { data } = await patientAPI.getAllPatients(doctorId);
      const patients = data as unknown as Patient[];

      dispatch({
        type: PatientsActionTypes.FETCH_PATIENTS_SUCCESS,
        payload: {
          // successMessage: "",
          patients,
        },
      });
    } catch (error: any) {
      dispatch({
        type: PatientsActionTypes.FETCH_PATIENTS_FAIL,
        payload: {
          errorMessage: "Something went wrong, failed to get patients",
        },
      });
    }
  };

export const addPatient =
  ( patient: Patient, history: History) =>
  async (
    dispatch: (arg0: { type: string; payload: PatientPayload }) => void
  ) => {
    try {
      await patientAPI.createPatient(patient);

      const { data } = await patientAPI.getAllPatients(patient.familyDoctor);
      const patients = data as unknown as Patient[];

      dispatch({
        type: PatientsActionTypes.CREATE_PATIENT_SUCCESS,
        payload: {
          successMessage: "Successfully created patient",
          patients,
        },
      });
    } catch (error: any) {
      dispatch({
        type: PatientsActionTypes.CREATE_PATIENT_FAIL,
        payload: {
          errorMessage: error.response.data.message,
        },
      });
    }

    history.push( "/patients" );
  };

export const updatePatient =
  (patient : Patient, history: History) =>
  async (
    dispatch: (arg0: { type: string; payload: PatientPayload }) => void
  ) => {
    try {
      await patientAPI.updatePatient(patient.id!, patient);

      const { data } = await patientAPI.getAllPatients(patient.familyDoctor);
      const patients = data as unknown as Patient[];

      dispatch({
        type: PatientsActionTypes.UPDATE_PATIENT_SUCCESS,
        payload: {
          successMessage: "Successfully updated patient",
          patients,
        },
      });
    } catch (error: any) {
      dispatch({
        type: PatientsActionTypes.UPDATE_PATIENT_FAIL,
        payload: {
          errorMessage: error.response.data.message,
        },
      });
    }
    
    history.push( "/patients" );
  };

export const deletePatinet =
  (patientId: string) =>
  async (
    dispatch: (arg0: { type: string; payload: PatientPayload }) => void
  ) => {
    try {
      await patientAPI.deletePatient(patientId);

      const { patients } = useSelector((state: GlobalState) => state.patients);

      dispatch({
        type: PatientsActionTypes.DELETE_PATIENT_SUCCESS,
        payload: {
          successMessage: "Successfully deleted patient",
          patients: patients.filter((patient) => patient.id !== patientId),
        },
      });
    } catch (error: any) {
      dispatch({
        type: PatientsActionTypes.DELETE_PATIENT_FAIL,
        payload: {
          errorMessage: error.response.data.message,
        },
      });
    }
  };


export const resetPatientMessages =
() => async (dispatch: (arg0: { type: string; payload: any }) => void) => {
  dispatch({
    type: PatientsActionTypes.RESET_MESSAGES,
    payload: {},
  });
};
