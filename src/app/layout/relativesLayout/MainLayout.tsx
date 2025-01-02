import Footer from "@/app/components/HomePage/Footer";
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
      <Footer />
    </div>
  );
}
