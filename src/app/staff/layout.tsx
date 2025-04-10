import LoadingPage from "./loading";
import { Suspense } from "react";
import StaffLayout from "../layout/staffLayout/StaffLayout";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<LoadingPage />}>
        <StaffLayout>{children}</StaffLayout>
      </Suspense>
      <Toaster />
    </div>
  );
}
