export const mapPatientKeys = (key: string) => {
    switch (key) {
        case "name":
            return "Име"
        case "surname":
            return "Презиме"
        case "petId":
            return "ПЕТ број"
        case "telephoneNumber":
            return "Телефонски број"
        case "secondTelephoneNumber":
            return "Втор телефонски број"
        case "dateOfBirth":
            return "Датум на раѓање"
        case "citizenship":
            return "Државјанство"
        case "sex":
            return "Пол";
        case "address":
            return "Адреса";
        case "EMBG":
            return "ЕМБГ"
        default:
            return key.charAt(0).toUpperCase() + key.slice(1)
    }
}
