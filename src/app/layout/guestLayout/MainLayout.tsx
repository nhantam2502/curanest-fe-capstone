import Footer from "@/app/components/HomePage/Footer";
import Header from "@/app/components/HomePage/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
