'use client'
import { useEffect } from "react";
import CategorySearch from "./components/HomePage/CategorySearch";
import Footer from "./components/HomePage/Footer";
import Header from "./components/HomePage/Header";
import Hero from "./components/HomePage/Hero";
import "./globals.css";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  useEffect(() => {
    AOS.init({
      // duration: 1200,
      // easing: "ease-in-out",
      // once: true,
      // mirror: false,
    });
  }, []);

  return (
    <div>
      <Header />
      {/* Hero section */}
      <Hero />
      {/* Footer */}
      <Footer />
    </div>
  );
}
