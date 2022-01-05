import { GetAllUsersResponseUsers } from "pet-user-management-sdk";
import { MouseEventHandler } from "react";
import { RouteComponentProps } from "react-router-dom";

export interface AuthenticationEvent {
  email: string;
  password: string;
}

export interface ErrorProps {
  content: string | undefined;
}

export interface AuthenticationProps {
  title: string;
  links: { href: string; content: string }[];
  onChange: (event: AuthenticationEvent) => void;
  onSubmit: () => void;
}

export type SubmitEmailProps = {
  buttonName: string;
  onChange: (event: { email: string }) => void;
  onSubmit: () => void;
};

export type MessagesState = {
  errorMessage: string;
  successMessage: string;
};

export interface PatientState extends MessagesState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  PET: number;
}

export enum UserRole {
  InstitutionalAdmin = "InstitutionalAdmin",
  NonMedical = "NonMedical",
  NonMedicalAdmin = "NonMedicalAdmin",
  Nurse = "Nurse",
  Physician = "Physician",
  PhysicianAdmin = "PhysicianAdmin",
  PhysicianInTraining = "PhysicianInTraining",
  RadiologyTechnologist = "RadiologyTechnologist",
  TechnologistAdmin = "TechnologistAdmin"
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  institution: string;
}

export interface Study {
  id: string;
  isStable: boolean;
  lastUpdate: string;
  // mainDicomTags: MainDicomTags
  institutionName: string,
  studyDate: string,
  studyDescription: string,
  studyID: string,
  studyTime: string
  type: string
  patientId: string;
  patientName: string
}

export interface StudiesResponse {
  id: string,
  isStable: boolean,
  lastUpdate: string,
  mainDicomTags: {
    accessionNumber: string,
    institutionName: string,
    referringPhysicianName: string,
    studyDate: string,
    studyDescription: string,
    studyID: string,
    studyInstanceUID: string,
    studyTime: string
  },
  parentPatient: string,
  series: string[],
  type: string
}

export interface PatientValidationProps {
  PET: number;
  firstName: string;
  lastName: string;
  telephoneNumber: string;
}

export interface ExaminationValidationProps {
  patientId: string;
  examinationType: string;
}

export interface Patient {
  name: string;
  surname: string;
  petId: string;
  telephoneNumber: string;
  createdAt: number;
  updatedAt?: number;
  secondTelephoneNumber?: string;
  email?: string;
  EMBG?: string;
  address?: string;
  citizenship?: string;
  dateOfBirth?: string;
  sex?: "male" | "female";
}

export interface Examination {
  id: string;
  patientId: string;
  examinationType: string;
  date?: number;
  height?: number;
  weight?: number;
  glycemia?: string;
  dose?: string;
  diagnose?: string;
  protocol?: string; //enum
  infectiousDisease?: boolean;
  infectiousDiseaseComment?: string;
  generalCondition?: string;
  companion?: boolean;
  companionComment?: string;
  doctorRefers?: string;
  clinicRefers?: string;
  asthma?: boolean;
  hyperthyroidism?: boolean;
  diabetes?: boolean;
  insulinTherapy?: boolean;
  lastMenstruation?: number;
  claustrophobia?: boolean;
  allergy?: boolean;
  pregnancy?: boolean;
  surgery?: boolean;
  surgeryNote?: string;
  radiotherapy?: boolean;
  radiotherapyNote?: string;
  chemotherapyImmunotherapy?: boolean;
  chemotherapyImmunotherapyNote?: string;
  petKT?: boolean;
  petKTNote?: string;
  boneScan?: boolean;
  boneScanNote?: string;
  gynecologicalDiseasesInterventions?: boolean;
  gynecologicalDiseasesInterventionsNote?: string;
  transplantation?: boolean;
  transplantationNote?: string;
  recentInjury?: boolean;
  recentInjuryNote?: string;
  kt?: boolean;
  ktNote?: string;
  mr?: boolean;
  mrNote?: string;
  nurseAnamnesis?: string;
  doctorAnamnesis?: string;
  changedBy?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Document {
  id: string;
  name: string;
  date: string;
  url?: string;
  isSend: boolean;
  type: string
}

export interface File {
  Key: string;
  LastModified: string;
  url: string;
  isSend: boolean;
  type: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: string;
  width?: string;
  align?: "right" | "left";
  format?: (value: number) => string;
}

//CUSTOM COMPONENTS

export interface ModalProps {
  buttonName: string | any;
  onClick?: Function;
  title: string;
  content: string | any;
  id: string;
  buttonSize?: "small" | "medium" | "large";
  isOpened?: (value: boolean) => void;
}

export interface TableProps {
  columns: Column[];
  rows: {
    onClick?: MouseEventHandler<HTMLTableRowElement>;
    elements: JSX.Element[];
  }[];
}

export interface CheckboxTableProps {
  columns: Column[];
  rows: {
    id: string
    elements: JSX.Element[];
  }[];
  onDownload: (fileKeys: string[]) => void
}

export interface SelectProps {
  name: string;
  onChange: (value: any) => void;
  items: any[];
  value: any;
  required?: boolean;
  disabled?: boolean;
  objectParametars?: string[];
  errorMessage?: string;
}

export interface DropdownMenuActionsProps {
  items: JSX.Element[];
}

export interface SendEmailProps {
  suggestedEmails: string[];
  documents: Document[];
  email: string;
  onClick: (emails: string[], selectedDocumentId: string) => void;
  // onChange: (value: string[]) => void;
  // onChangeSelectedDocument: (document: string) => void;
  defaultDocument: Document;
  className?: string;
}

export interface StudiesListProps extends RouteComponentProps {
  studies: Study[];
  isBusy: boolean;
  downloadStudy: (studyUid: string, studyId: string) => void
}

export interface DocumentComponentProps extends RouteComponentProps {
  documents: Document[];
  handleDelete: (documentId: string) => void;
  handleSubmit: (files: FormData) => void;
  patient?: Patient;
  examination?: Examination;
  sendToEmail?: string;
  isBusy: boolean;
  handleSendEmail?: (emails: string[], selectedDocumentId: string) => void;
  handleMultipleDownload: (fileKeys: string[]) => void
}

export interface ExaminationListProps extends RouteComponentProps {
  examinations: Examination[];
  isBusy: boolean;
  patientId: string;
  handleDelete: (id: string) => void
}

export interface RadioButtonProps {
  onChangeRadio: (value: boolean) => void;
  radioLabel: string
  value: boolean;
  onChangeText?: (value: string) => void;
  textLabel?: string
  text?: string;
  disabled?: boolean
}

//TABLE COLUMNS

export interface PatientColumn {
  id:
  | "createdAt"
  | "name"
  | "surname"
  | "email"
  | "petId"
  | "EMBG"
  | "address"
  | "citizenship"
  | "dateOfBirth"
  | "telephoneNumber"
  | "secondTelephoneNumber"
  | "sex";
  label: string;
  minWidth?: string;
  width?: string;
  align?: "right";
  format?: (value: number) => string;
}

export interface StudyColumn {
  id: "lastUpdate" | "studyDate" | "institutionName" | "studyDescription" | "studyID" | "patientName" | "patientId";
  label: string;
  minWidth?: string;
  width?: string;
  align?: "right";
  format?: (value: number) => string;
}

export interface DocumentColumn {
  id: "name" | "date";
  label: string;
  minWidth?: string;
  width?: string;
  align?: "right";
  format?: (value: number) => string;
}

export interface UserColumn {
  id: "role" | "firstName" | "lastName" | "email" | "institution";
  label: string;
  minWidth?: string;
  width?: string;
  align?: "right";
  format?: (value: number) => string;
}

export interface ExaminationColumn {
  id:
  | "updatedAt"
  | "changedBy"
  | "examinationType"
  | "date"
  label: string;
  minWidth?: string;
  width?: string;
  align?: "right";
  format?: (value: number) => string;
}

// VALIDATION

export interface UserFormProps extends MessagesState {
  title: string;
  isUpdate: boolean;
  user?: User;
  onSubmit: (value: User) => void;
}

// REDUCER STATE
export interface UserState extends MessagesState {
  profile: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userAttributes: {
      [key: string]: any;
    };
  };
  users: User[];
  accessToken: string;
  sessionToken: string;
  filledDetails: boolean | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export interface PatientsState extends MessagesState {
  patients: Patient[];
  isLoading: boolean,
}

export interface PatientPayload {
  patients?: Patient[];
  errorMessage?: string;
  successMessage?: string;
}

export interface UnassignesStudies {
  id: string;
  isStable: boolean;
  lastUpdate: string;
  mainDicomTags: MainDicomTags;
  parentPatient: string;
  patientMainDicomTags: PatientMainDicomTags;
  series?: (string)[] | null;
  type: string;
  accessionNumber: string;
  institutionName: string;
  referringPhysicianName: string;
  studyDate: string;
  studyDescription: string;
  studyID: string;
  studyInstanceUID: string;
  studyTime: string;
  patientId: string;
  patientBirthDate: string;
  patientName: string;
  patientSex: string;
}
export interface MainDicomTags {
  accessionNumber: string;
  institutionName: string;
  referringPhysicianName: string;
  studyDate: string;
  studyDescription: string;
  studyID: string;
  studyInstanceUID: string;
  studyTime: string;
}
export interface PatientMainDicomTags {
  patientId: string;
  patientBirthDate: string;
  patientName: string;
  patientSex: string;
}

export interface UnassignesStudiesState extends MessagesState {
  studies: UnassignesStudies[];
  isLoading: boolean,
}
export interface UnassignedStudiesPayload {
  studies?: UnassignesStudies[];
  errorMessage?: string;
  successMessage?: string;
}
