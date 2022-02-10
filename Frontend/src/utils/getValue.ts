import moment from "moment";

const formatDate = (date: string) => {
  return moment(date).format("DD-MM-yyyy");
};

export const getValue = (column: string, value: string | number) => {
  if (
    column === "createdAt" ||
    column === "updatedAt" ||
    column === "date" ||
    column === "birthDate" ||
    column === "dateOfBirth" ||
    column === "lastUpdate"
  ) {
    return value ? formatDate(value as string) : "/";
  } else {
    return value || "/";
  }
};
