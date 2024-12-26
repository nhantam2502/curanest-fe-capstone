import RelativesNavbar from "./RelativesNavbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <RelativesNavbar />
      <div>{children}</div>
    </div>
  );
}
