import { DoneResult } from "../types";
import { PatientTable, PatientEntity, ExaminationTable } from "../database/entities";
import { codedError } from "../lib/coded-error";
import HTTP from "http-status-codes";
import { v4 as uuid} from "uuid";

export class PatientManager {

    /**
     *
     *
     * @param {Patient} data
     * @return {*}  {(Promise<DoneResult & { id: string }>)}
     * @memberof PatientManager
     */
    async addPatient(data: PatientEntity): Promise<DoneResult & { id: string }> {
        data.id = uuid();
        const patient: PatientEntity = await PatientTable.create(data);

        return { done: true, id: patient.id };
    }

    /**
     *
     *
     * @param {Patient} updatedData
     * @return {*}  {Promise<DoneResult>}
     * @memberof PatientManager
     */
    async updatePatientDetails(id: string, updatedData: Partial<PatientEntity>): Promise<DoneResult> {
        await PatientTable.update(updatedData, {
            where: {
                id
            }
        });

        return { done: true };
    }

    /**
     *
     *
     * @param {string} id
     * @return {*}  {Promise<DoneResult>}
     * @memberof PatientManager
     */
    async deletePatient(id: string): Promise<DoneResult> {
        try {
            await this.getPatient(id);
        } catch (e) {
            throw codedError(HTTP.BAD_REQUEST, "Can't be deleted patient that doesn't exists!")
        }

        await ExaminationTable.destroy({
            where: {
                patientId: id
            }
        })
        await PatientTable.destroy({
            where: {
                id
            }
        })

        return { done: true };
    }

    /**
     *
     *
     * @param {string} patientId
     * @return {*}  {Promise<Patient>}
     * @memberof PatientManager
     */
    async getPatient(patientId: string): Promise<PatientEntity> {
        const patient = await PatientTable.findOne({
            where: {
                id: patientId,
            },
            raw: true
        });

        if (!patient || !patientId) {
            throw codedError(HTTP.NOT_FOUND, `Patient does not exist`);
        }

        return patient;
    }

    /**
     *
     *
     * @return {*}  {Promise<Patient[]>}
     * @memberof PatientManager
     */
    async getAllPatients(): Promise<PatientEntity[]> {
        console.log("get all in manager");
        const patients = await PatientTable.findAll({ raw: true });
        if (!patients) {
            throw codedError(HTTP.NO_CONTENT, "There are no patients in the system")
        }
        return patients;
    }

}
