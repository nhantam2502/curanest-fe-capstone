import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import LoadingPage from "./loading";
import NurseLayout from "../layout/nurseLayout/NurseLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<LoadingPage />}>
        <NurseLayout>{children}</NurseLayout>
        <Toaster />
      </Suspense>
    </div>
  );
}
