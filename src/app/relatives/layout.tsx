import MainLayout from "@/app/layout/relativesLayout/MainLayout";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import LoadingPage from "./loading";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<LoadingPage />}>
        <MainLayout>{children}</MainLayout>
        <Toaster />
      </Suspense>
    </div>
  );
}
