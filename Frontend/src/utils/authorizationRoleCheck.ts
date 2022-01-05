const createPatientPermissions = [
    "Nurse",
    "RadiologyTechnologist",
    "Physician",
    "PhysicianAdmin",
    "TechnologistAdmin",
    "NonMedicalAdmin"
]


export const isAuthorizedToCreatePatient = (role: string) => {
    return createPatientPermissions.includes(role)
}
    