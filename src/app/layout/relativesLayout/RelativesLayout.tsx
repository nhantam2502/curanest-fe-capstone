import Footer from "@/app/components/Relatives/Footer";
import RelativesNavbar from "./RelativesNavbar";

export default function RelativesLayout({
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
