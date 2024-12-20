export type User = {
  id: string;
  email: string;
  password: string;
  role: "user" | "nurse" | "staff" | "admin";
};
