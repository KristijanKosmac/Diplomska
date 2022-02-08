import axios from "axios"
import { Patient } from "../types";

export type WindowConfig = Window & {
    env: { BACKEND_ENDPOINT: string;};
  };
  
const backendEndpoint = process.env.REACT_APP_BACKEND_ENDPOINT || ""

class PatientAPI {
    endpoint: string;

    constructor(backendEndpoint: string, route:string) {
        this.endpoint = `${backendEndpoint}/${route}`
    }

    getAllPatients(doctorId: string) {
        return axios.get(`${this.endpoint}`, { params: { doctorId }})
    }

    getPatient(id: string) {
        return axios.get(`${this.endpoint}/${id}`)
    }

    createPatient(patient: Patient) {
        return axios.post(`${this.endpoint}`, patient)
    }

    updatePatient(id: string, patient: Patient) {
        return axios.put(`${this.endpoint}/${id}`, patient)
    }

    deletePatient(id: string) {
        return axios.delete(`${this.endpoint}/${id}`)
    }

    uploadFiles(id: string, files: FormData) {
        return axios.post(`${this.endpoint}/${id}/documents`, files)
    }

    deleteFile(id: string, fileName: string) {
        return axios.delete(`${this.endpoint}/${id}/documents`, { params: { fileName }})
    }

    getAllFiles(id: string) {
        return axios.get(`${this.endpoint}/${id}/documents`)
    }

    sendEmail(id: string, emails: string[], text: string, filesIds: string[]) {
        return  axios.post(`${this.endpoint}/${id}/documents/send-email`,{ emails, text, filesIds })
    }

    getMultipleFiles(id: string, documentIds: string[]) {
        return  axios.post(`${this.endpoint}/${id}/documents/download`, { documentIds })
    }

}

const patientAPI = new PatientAPI(backendEndpoint, "patient")
export { patientAPI }