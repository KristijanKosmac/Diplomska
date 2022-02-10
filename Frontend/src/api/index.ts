export { doctorAPI } from "./doctor"
export { patientAPI } from "./patient"
export { userAPI } from "./user"

export type WindowConfig = Window & {
  env: { BACKEND_ENDPOINT: string; USER_MANAGEMENT_ENDPOINT: string };
};

export function getAccessToken(): string | undefined {
  return localStorage.getItem("accessToken") || undefined;
}