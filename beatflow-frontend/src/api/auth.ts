import { authClient } from "./authClient";

export type Credentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
};

export const register = async (data: Credentials): Promise<void> => {
  await authClient.post("/register", data);
};

export const login = async (data: Credentials): Promise<LoginResponse> => {
  const response = await authClient.post<LoginResponse>("/login", data);
  return response.data;
};

export const refresh = async (): Promise<LoginResponse> => {
  const response = await authClient.post<LoginResponse>("/refresh", {});
  return response.data;
};

export const logout = async (): Promise<void> => {
  await authClient.post("/logout", {});
};
