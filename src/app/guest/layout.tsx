import { Suspense } from "react";
import MainLayout from "../layout/guestLayout/MainLayout";
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
      </Suspense>
    </div>
  );
}
