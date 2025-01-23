"use client";
import React from "react";
import Header from "../components/HomePage/Header";
import Footer from "../components/HomePage/Footer";
import Hero from "../components/HomePage/Hero";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const UserPage = () => {
  const { data: session, status } = useSession();

  // Debug session and status
  console.log("Session data:", session);
  console.log("Session status:", status);
  
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/relatives");
  }

  return (
    <div>
      <Header />
      <Hero />
      <Footer />
    </div>
  );
};

export default UserPage;
