"use client";
import { useEffect } from "react";
import "./globals.css";
import AOS from "aos";
import "aos/dist/aos.css";
import GuestPage from "./guest/page";

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
      <GuestPage />
    </div>
  );
}
