import Footer from "@/app/components/Relatives/Footer";
import RelativesNavbar from "./RelativesNavbar";

export default function RelativesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <RelativesNavbar />
      <div  className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
