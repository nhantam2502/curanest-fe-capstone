import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { Suspense } from "react";
import LoadingPage from "./loading";

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
        <body>
          <Suspense fallback={<LoadingPage />}>{children}</Suspense>
        </body>
      </html>
    </AuthProvider>
  );
}
