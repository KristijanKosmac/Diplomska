export const mapPatientKeys = (key: string) => {
    switch (key) {
        case "firstName":
            return "Name"
        case "lastName":
            return "Surname"
        case "telephoneNumber":
            return "Telephone number"
        case "dateOfBirth":
            return "Date of birth"
        case "nationality":
            return "Nationality"
        case "sex":
            return "Sex";
        case "address":
            return "Address";
        case "EMBG":
            return "EMBG"
        case "familyDoctor":
            return "Family Doctor"
        default:
            return key.charAt(0).toUpperCase() + key.slice(1)
    }
}
