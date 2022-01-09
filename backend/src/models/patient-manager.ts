import HTTP from "http-status-codes";
import fs from "fs"
import { DoneResult, File } from "../types";
import { Patient, PatientInteface } from "../database/entities";
import { codedError } from "../lib/coded-error";

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

    async uploadFiles(files: any): Promise<DoneResult> {
        if (!files || files!.length === 0) {
            throw codedError(HTTP.NO_CONTENT, "There are no files")
        }
        return { done: true };
    }

    async getAllFiles(patientId: string): Promise<File[]> {
        const path = `src/documents/${patientId}/`
        const filenames = fs.readdirSync(path)
        const files: File[] = filenames.map(function(filename) {
            const content = fs.readFileSync(path + filename, {encoding: "utf8"})

            return { filename, content }
          });
    
        return files
    }

}
