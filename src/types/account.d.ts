export type User = {
  id: string;
  email: string;
  password: string;
  role: "relatives" | "nurse" | "staff" | "admin";
};
