import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import LoadingPage from "./loading";
import RelativesLayout from "../layout/relativesLayout/RelativesLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<LoadingPage />}>
        <RelativesLayout>{children}</RelativesLayout>
        <Toaster />
      </Suspense>
    </div>
  );
}
