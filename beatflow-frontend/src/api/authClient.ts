import { createClient } from "./baseClient";

export const authClient = createClient(import.meta.env.VITE_AUTH_API);
