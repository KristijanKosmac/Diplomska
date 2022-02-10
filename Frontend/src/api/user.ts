import axios from "axios";

const backendEndpoint = process.env.REACT_APP_BACKEND_ENDPOINT || "";

class UserAPI {
  endpoint: string;

  constructor(backendEndpoint: string, route: string) {
    this.endpoint = `${backendEndpoint}/${route}`;
  }

  changePassword(id: string, password: string) {
    return axios.put(`${this.endpoint}/${id}`, { password });
  }

  signUp(email: string, password: string) {
    return axios.post(`${this.endpoint}/sign-up`, { password, email })
  }

  signIn(email: string, password: string) {
    return axios.post(`${this.endpoint}/sign-in`, { password, email })
  }

  resetPassword(email: string) {
    return axios.post(`${this.endpoint}/reset-password`, { email })
  }
}

const userAPI = new UserAPI(backendEndpoint, "user");

export { userAPI };
