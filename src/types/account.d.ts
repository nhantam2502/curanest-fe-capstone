export type User = {
  id: string;
  email: string;
  phone: string | null;
  password: string;
  role: "relatives" | "nurse" | "staff" | "admin";
};
