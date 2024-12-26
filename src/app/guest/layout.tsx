import MainLayout from "../layout/guestLayout/MainLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <MainLayout>{children}</MainLayout>
    </div>
  );
}
