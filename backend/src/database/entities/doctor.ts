import mongoose from "mongoose"
import validator from "validator"
import { PatientInteface } from "."

export interface DoctorInteface {
    id: string;
    firstName: string;
    lastName: string;
    EMBG: number;
    dateOfBirth: string;
    email: string;
    role: "Doctor" | "Patient"
    address?: string;
    telephoneNumber?: number
    institution?: string
    country?: string;
    city?: string;
    nationality?: string;
    patients?: PatientInteface[]
}

const doctorSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        trim: true,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    EMBG: {
        type: Number,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate(value: any){
            if (!validator.isEmail(value)) {
               throw new Error("Email is invalid!") 
            }
        }
    },
    role: {
        type: String,
        require: true,
        enum: ["Doctor", "Patient"]
    },
    telephoneNumber: {
        type: Number,
    },
    institution: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    nationality: {
        type: String
    },
    address: {
        type: String
    }
}, {
    timestamps: true
})

// Ensure virtual fields are serialised.
doctorSchema.set('toJSON', {
    virtuals: true
});

doctorSchema.virtual('patients', {
    ref: 'Patient',
    localField: 'id',
    foreignField: 'familyDoctor'
})

const Doctor = mongoose.model<DoctorInteface>("Doctor", doctorSchema)

export { Doctor }