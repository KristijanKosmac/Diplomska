import { PatientsActionTypes } from "../../constants/index";
import { Patient, PatientPayload } from "../../types";
import { getPetBackendAPI } from "../../api";
import { useSelector } from "react-redux";
import { GlobalState } from "../../reducers";

export const getAllPatients =
  () =>
  async (
    dispatch: (arg0: { type: string; payload: PatientPayload }) => void
  ) => {
    dispatch({
      type: PatientsActionTypes.FETCH_PATIENTS_SUCCESS_START,
      payload: {}
    });

    try {
      const { data } = await getPetBackendAPI().getAllPatients();
      const patientsData = data as unknown as Patient[];

      const patients = patientsData.sort((a, b) =>
        new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime() ? 1 : -1
      );

      dispatch({
        type: PatientsActionTypes.FETCH_PATIENTS_SUCCESS,
        payload: {
          successMessage: "",
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
  ({
    name,
    petId,
    surname,
    telephoneNumber,
    EMBG,
    address,
    citizenship,
    dateOfBirth,
    email,
    secondTelephoneNumber,
    sex,
  }: Patient) =>
  async (
    dispatch: (arg0: { type: string; payload: PatientPayload }) => void
  ) => {
    try {
      await getPetBackendAPI().addPatient({
        name,
        surname,
        petId: petId!.toString(),
        telephoneNumber,
        EMBG: EMBG!.toString(), 
        address,
        citizenship,
        dateOfBirth: parseInt(dateOfBirth!),
        secondTelephoneNumber,
        sex: sex as any,
        email,
      });

      const { data } = await getPetBackendAPI().getAllPatients();
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
  };

export const updatePatient =
  ({
    name,
    petId,
    surname,
    telephoneNumber,
    EMBG,
    address,
    citizenship,
    dateOfBirth,
    email,
    secondTelephoneNumber,
    sex,
    createdAt
  }: Patient) =>
  async (
    dispatch: (arg0: { type: string; payload: PatientPayload }) => void
  ) => {
    try {
      await getPetBackendAPI().updatePatientDetails(petId, {
        name,
        surname,
        petId: petId!.toString(),
        telephoneNumber,
        EMBG: EMBG!.toString(), 
        address,
        citizenship,
        dateOfBirth: parseInt(dateOfBirth!),
        secondTelephoneNumber,
        sex: sex as any,
        email,
        createdAt
      });

      const { data } = await getPetBackendAPI().getAllPatients();
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
  };

export const deletePatinet =
  (petId: string) =>
  async (
    dispatch: (arg0: { type: string; payload: PatientPayload }) => void
  ) => {
    try {
      await getPetBackendAPI().deletePatient(petId);

      const { patients } = useSelector((state: GlobalState) => state.patients);

      dispatch({
        type: PatientsActionTypes.DELETE_PATIENT_SUCCESS,
        payload: {
          successMessage: "Successfully deleted patient",
          patients: patients.filter((patient) => patient.petId !== petId),
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
