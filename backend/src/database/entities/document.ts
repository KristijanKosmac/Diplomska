import mongoose from "mongoose"

export interface DocumentInterface {
    id: string;
    comment: string
    updatedAt: string
}

const documentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    comment: {
        type: String,
    }
}, {
    timestamps: true
})

// Ensure virtual fields are serialised.
documentSchema.set('toJSON', {
    virtuals: true
});

const Document = mongoose.model<DocumentInterface>("Document", documentSchema)

export { Document }