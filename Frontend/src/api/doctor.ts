import axios from "axios"
import { Doctor } from "../types";
  
const backendEndpoint = process.env.REACT_APP_BACKEND_ENDPOINT || ""

class DoctorAPI {
    endpoint: string;

    constructor(backendEndpoint: string, route:string) {
        this.endpoint = `${backendEndpoint}/${route}`
    }

    getDoctor(id: string) {
        return axios.get(`${this.endpoint}/${id}`)
    }

    getAllDoctors() {
        return axios.get(`${this.endpoint}`)
    }
 
    createDoctor(doctor: Doctor) {
        return axios.post(`${this.endpoint}`, doctor)
    }

    updateDoctor(id: string, doctor: Doctor) {
        return axios.put(`${this.endpoint}/${id}`, doctor)
    }

    deleteDoctor(id: string) {
        return axios.delete(`${this.endpoint}/${id}`)
    }

}

const doctorAPI = new DoctorAPI(backendEndpoint, "doctor")

export { doctorAPI }