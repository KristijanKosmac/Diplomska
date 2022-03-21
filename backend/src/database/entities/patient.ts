import mongoose from "mongoose"
import validator from "validator"

export interface PatientInteface {
    id?: string;
    firstName: string;
    lastName: string;
    EMBG: number;
    dateOfBirth: string;
    email: string;
    address?: string;
    telephoneNumber?: number
    height?: number;
    weight?: number;
    sex?: "Male" | "Female";
    country?: string;
    city?: string;
    nationality?: string;
    bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O-" | "O+"
    familyDoctor: string
}

const patientSchema = new mongoose.Schema({
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
    address: {
        type: String
    },
    telephoneNumber: {
        type: Number,
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    sex: {
        type: String,
        enum: ["Male", "Female"]
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
    familyDoctor: {
        type: String,
        required: true,
        ref: 'Doctor'
    }, 
    bloodType: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O-", "O+"]
    }
}, {
    timestamps: true
})

// patientSchema.virtual('id').get(function(){
//     return this._id.toHexString();
// });

// Ensure virtual fields are serialised.
patientSchema.set('toJSON', {
    virtuals: true
});

const Patient = mongoose.model<PatientInteface>("Patient", patientSchema)

export { Patient }