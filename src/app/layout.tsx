import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";

export const metadata: Metadata = {
  title: "Curanest",
  description: "Tận tâm chăm sóc sức khỏe gia đình bạn.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
