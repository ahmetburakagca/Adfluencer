import { BaseService } from "./BaseService";
import { AxiosResponse } from "axios";

interface LoginParams {
  email: string;
  password: string;
}

export class AuthService extends BaseService {
  constructor() {
    super("https://localhost:5000/Auth");
  }

  async register(formData: FormData): Promise<unknown> {
    try {
      return this.axiosInstance.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async login(params: LoginParams): Promise<AxiosResponse> {
    return this.axiosInstance.post("/login", params, {
      headers: { "Content-Type": "application/json" },
    });
  }
}
