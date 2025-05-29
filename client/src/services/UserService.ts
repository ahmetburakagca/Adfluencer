import { BaseService } from "./BaseService";
import { User, ContentCreator } from "../types";

export class UserService extends BaseService {
  constructor() {
    super("https://localhost:5000/Users");
  }

  async getUserById(id: number): Promise<User> {
    return this.get<User>(`/${id}`);
  }

  async updateUser(id: number, formData: FormData): Promise<User> {
    return this.axiosInstance
      .put<User>(`/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data);
  }

  async createMultipleUsers(users: Omit<User, "id">[]): Promise<User[]> {
    return this.post<User[]>("/multiple", users);
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.get<User[]>(`/search?query=${encodeURIComponent(query)}`);
  }

  async validateUser(username: string): Promise<boolean> {
    return this.get<boolean>(
      `/validate?username=${encodeURIComponent(username)}`
    );
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>("/me");
  }

  async getContentCreators(): Promise<{ data: ContentCreator[] }> {
    return this.get<{ data: ContentCreator[] }>("/contentcreators");
  }

  async searchContentCreators(params: {
    category?: string;
    minFollowers?: number;
    maxFollowers?: number;
    minScore?: number;
    maxScore?: number;
  }): Promise<ContentCreator[]> {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append("category", params.category);
    if (params.minFollowers !== undefined)
      queryParams.append("minFollowers", params.minFollowers.toString());
    if (params.maxFollowers !== undefined)
      queryParams.append("maxFollowers", params.maxFollowers.toString());
    if (params.minScore !== undefined)
      queryParams.append("minScore", params.minScore.toString());
    if (params.maxScore !== undefined)
      queryParams.append("maxScore", params.maxScore.toString());
    return this.get<ContentCreator[]>(`/search?${queryParams.toString()}`);
  }
}
