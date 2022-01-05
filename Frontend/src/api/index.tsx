import { MsUserApi } from "pet-user-management-sdk";
import { MsPetApi } from "pet-backend-sdk";

export type WindowConfig = Window & {
  env: { BACKEND_ENDPOINT: string; USER_MANAGEMENT_ENDPOINT: string };
};

export function getAccessToken(): string | undefined {
  if (process.env.NODE_ENV === "test") {
    return "testing_access_token";
  }
  return localStorage.getItem("accessToken") || undefined;
}

export function getUserManagementAPI() {
  return new MsUserApi({
    basePath:
      process.env.REACT_APP_USER_MANAGEMENT_ENDPOINT ||
      (window as unknown as WindowConfig).env.USER_MANAGEMENT_ENDPOINT,
    accessToken: getAccessToken(),
  });
}

export function getPetBackendAPI() {
  return new MsPetApi({
    // basePath: "http://localhost:80"
    basePath:
      process.env.REACT_APP_BACKEND_ENDPOINT ||
      (window as unknown as WindowConfig).env.BACKEND_ENDPOINT,
    accessToken: getAccessToken(),
  });
}
