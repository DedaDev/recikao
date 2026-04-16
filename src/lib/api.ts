import ky from "ky";

export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export const api = ky.create({ prefix: API_BASE });

export const authApi = (token: string) =>
  api.extend({ headers: { Authorization: `Bearer ${token}` } });
