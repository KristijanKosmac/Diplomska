export { doctorAPI } from "./doctor"
export { patientAPI } from "./patient"

export type WindowConfig = Window & {
  env: { BACKEND_ENDPOINT: string; USER_MANAGEMENT_ENDPOINT: string };
};

export function getAccessToken(): string | undefined {
  return localStorage.getItem("accessToken") || undefined;
}

export function getUserManagementAPI(): any {
// return new MsUserApi({
//   basePath: "",
  //   accessToken: getAccessToken(),
  // });
}

export function getPetBackendAPI(): any {
  // return new MsPetApi({
  //   // basePath: "http://localhost:80"
  //   basePath: "",
  //   accessToken: getAccessToken(),
  // });
}
