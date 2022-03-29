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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  institution: string;
}

export interface PatientValidationProps {
  firstName: string;
  lastName: string;
  EMBG: number;
  dateOfBirth: string;
  email: string;
  familyDoctor: string
}

export interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  EMBG: number;
  dateOfBirth: string;
  email: string;
  familyDoctor: string
  address?: string;
  telephoneNumber?: number
  height?: number;
  weight?: number;
  sex?: "Male" | "Female";
  bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O-" | "O+"
  country?: string;
  city?: string;
  nationality?: string;
}

export interface DoctorValidation {
  id: string,
  EMBG: number,
  dateOfBirth: string,
  email: string,
  firstName: string,
  lastName: string,
}
export interface Document {
  id: string;
  name: string;
  date: string;
  content: string;
  comment: string;
}

export interface DocumentComment {
  fileName: string;
  comment: string
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
  disabled?: boolean;
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

export interface DatePickerProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export interface DropdownMenuActionsProps {
  items: JSX.Element[];
}

export interface SendEmailProps {
  suggestedEmails: string[];
  documents: Document[];
  email: string;
  onClick: (emails: string[], selectedDocumentId: string, text: string) => void;
  // onChange: (value: string[]) => void;
  // onChangeSelectedDocument: (document: string) => void;
  defaultDocument: Document;
  text?: string;
  className?: string;
}

export interface DocumentComponentProps extends RouteComponentProps {
  documents: Document[];
  handleDelete: (documentId: string) => void;
  handleSubmit: (files: FormData, documentsComments: DocumentComment[]) => void;
  patient?: Patient;
  sendToEmail?: string;
  isBusy: boolean;
  handleSendEmail?: (emails: string[], selectedDocumentId: string, text: string) => void;
  handleMultipleDownload: (fileKeys: string[]) => void
  handleEditDocument: (documentId: string, oldDocumentId: string, comment: string, newComment: string) => void
}

export interface FolderComponentProps extends RouteComponentProps {
  patientId: string;
  onClick: (folderName: string) => void;
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
  | "firstName"
  | "lastName"
  | "email"
  | "EMBG"
  | "address"
  | "nationality"
  | "dateOfBirth"
  | "telephoneNumber"
  | "sex";
  label: string;
  minWidth?: string;
  width?: string;
  align?: "right";
  format?: (value: number) => string;
}

export interface DocumentColumn {
  id: "name" | "date" | "comment";
  label: string;
  minWidth?: string;
  width?: string;
  align?: "right";
  format?: (value: number) => string;
}

export interface UserColumn {
  id: "firstName" | "lastName" | "email" | "institution" | "dateOfBirth" | "city";
  label: string;
  minWidth?: string;
  width?: string;
  align?: "right";
  format?: (value: number) => string;
}

// VALIDATION

export interface DoctorFormProps extends MessagesState {
  title: string;
  isUpdate: boolean;
  doctor?: Doctor;
  onSubmit: (value: Doctor) => void;
}

// REDUCER STATE
export interface UserState extends MessagesState {
  profile: Doctor;
  users: Doctor[];
  accessToken: string;
  sessionToken: string;
  filledDetails: boolean | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  errorMessage: string,
  successMessage: string
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

/// *********** NEW TYPES ************

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  EMBG: number;
  dateOfBirth: string;
  email: string;
  address?: string;
  telephoneNumber?: number
  institution?: string
  country?: string;
  city?: string;
  nationality?: string;
  // patients?: PatientInteface[]
}