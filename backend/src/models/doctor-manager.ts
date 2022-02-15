import { DoneResult } from "../types";
import { Doctor, DoctorInteface } from "../database/entities";
import { codedError } from "../lib/coded-error";
import HTTP from "http-status-codes";

class DoctorManager {

    async addDoctor(data: DoctorInteface): Promise<DoneResult & { id: string }> {
        const doctor = new Doctor(data);

        try {
            const exists = await Doctor.findOne({id: data.id})
            if ( exists ) {
                throw codedError(HTTP.BAD_REQUEST, `Doctor with same id already exist`);
            }

            await doctor.save()
        } catch (e) {
            console.log(e)
            throw e
        }

        return { done: true, id: doctor.id };
    }

    async updateDoctor(id: string, updatedData: DoctorInteface): Promise<DoneResult> {
        try {
            const exists = await Doctor.findOne({id})
            if ( exists ) {
                await Doctor.findOneAndUpdate({id}, updatedData, {new: true, runValidators: true}) 
            } else {
                const doctor = new Doctor(updatedData);
                await doctor.save()
            }
        } catch (e) {
            throw e
        }

        return { done: true };
    }

    async deleteDoctor(id: string): Promise<DoneResult> {
        try {
            await Doctor.findOneAndDelete({id}) 
        } catch (e) {
            throw codedError(HTTP.BAD_REQUEST, "Can't be deleted doctor that doesn't exists!")
        }

        return { done: true };
    }

    async getDoctor(id: string): Promise<DoctorInteface> {
        const doctor = await Doctor.findOne({id})

        if (!doctor || !id) {
            throw codedError(HTTP.NOT_FOUND, `Doctor does not exist`);
        }
        await doctor.populate({
            path: 'patients',
        }).execPopulate()

        return doctor;
    }

    async getAllDoctors(): Promise<DoctorInteface[]> {
        const doctors = await Doctor.find()
        if (!doctors) {
            throw codedError(HTTP.NO_CONTENT, "There are no doctors in the system")
        }
        return doctors;
    }
}

export const doctorManager = new DoctorManager()