import { DoneResult } from "../types";
import { Patient, PatientInteface } from "../database/entities";
import { codedError } from "../lib/coded-error";
import HTTP from "http-status-codes";

export class PatientManager {

    async addPatient(data: PatientInteface): Promise<DoneResult & { id: string }> {
        const patient = new Patient(data);

        try {
            await patient.save()
        } catch (e) {
            throw e
        }

        // TODO CHECK IF patient.id work if it doenst change it with patient._id
        return { done: true, id: patient.id };
    }

    async updatePatient(id: string, updatedData: PatientInteface): Promise<DoneResult> {
        try {
            await Patient.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
        } catch (e) {
            throw e
        }

        return { done: true };
    }

    async deletePatient(id: string): Promise<DoneResult> {
        try {
            await Patient.findByIdAndRemove(id)
        } catch (e) {
            throw codedError(HTTP.BAD_REQUEST, "Can't be deleted patient that doesn't exists!")
        }

        return { done: true };
    }

    async getPatient(id: string): Promise<PatientInteface> {
        const patient = await Patient.findById(id)

        if (!patient || !id) {
            throw codedError(HTTP.NOT_FOUND, `Patient does not exist`);
        }

        return patient;
    }

    async getAllPatientsForDoctor(doctorId: string): Promise<PatientInteface[]> {
        const patients = await Patient.find({ familyDoctor: doctorId })
        if (!patients) {
            throw codedError(HTTP.NO_CONTENT, "There are no patients in the system")
        }
        return patients;
    }

}
