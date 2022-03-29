import axios from "axios"
import { DocumentComment, Patient } from "../types";

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

    // uploadFiles(id: string, files: FormData) {
    //     return axios.post(`${this.endpoint}/${id}/documents`, files)
    // }

    uploadFiles(id: string, folderName: string, files: FormData ) {
        return axios.post(`${this.endpoint}/${id}/folder/${folderName}/upload`, files )
    }

    uploadFilesComments(id: string, folderName: string, documents: DocumentComment[] ) {
        return axios.post(`${this.endpoint}/${id}/folder/${folderName}/files-comments`, { documents } )
    }

    updateDocument(id: string, folderName: string, documentId: string, oldDocumentId: string, comment: string) {
        return axios.put(`${this.endpoint}/${id}/folder/${folderName}/file-edit`, { documentId, oldDocumentId, comment } )
    }

    deleteFile(documentId: string) {
        return axios.delete(`${this.endpoint}/documentId/documents`, {data: {id: documentId} })
    }

    getAllFiles(id: string) {
        return axios.get(`${this.endpoint}/${id}/documents`)
    }

    getAllFolders(id: string) {
        return axios.get(`${this.endpoint}/${id}/folder`)
    }

    getAllFilesFromFolder(id:string, folderName: string) {
        return axios.get(`${this.endpoint}/${id}/folder/${folderName}`)
    }

    createFolder (id:string, folderName: string) {
        return axios.post(`${this.endpoint}/${id}/folder/${folderName}`)
    }

    deleteFolder (id:string, folderName: string) {
        return axios.delete(`${this.endpoint}/${id}/folder/${folderName}`)
    }

    renameFolder (id:string, folderName: string, newFolderName: string) {
        return axios.put(`${this.endpoint}/${id}/folder/${folderName}`, { newFolderName })
    }

    sendEmail(id: string, emails: string[], text: string, filesIds: string[]) {
        return  axios.post(`${this.endpoint}/${id.split("/")[0]}/documents/send-email`,{ id, emails, text, filesIds })
    }

    getMultipleFiles(id: string, documentIds: string[]) {
        return  axios.post(`${this.endpoint}/${id}/documents/download`, { documentIds })
    }

}

const patientAPI = new PatientAPI(backendEndpoint, "patient")
export { patientAPI }