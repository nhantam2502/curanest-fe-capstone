import AdminLayout from "@/app/layout/adminLayout/AdminLayout";
import LoadingPage from "./loading";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<LoadingPage />}>
        <AdminLayout>{children}</AdminLayout>
      </Suspense>
      <Toaster />
    </div>
  );
}
