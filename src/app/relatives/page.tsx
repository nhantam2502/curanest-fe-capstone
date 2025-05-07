"use client";
import React, { useEffect } from "react";
import Header from "../components/HomePage/Header";
import Footer from "../components/HomePage/Footer";
import Hero from "../components/HomePage/Hero";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

const UserPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const lastPage = localStorage.getItem("lastPage");

    if (session) {
      router.push(lastPage || "/relatives/booking");
    } else {
      router.push("/api/auth/signin?callbackUrl=/relatives");
    }
  }, [session, router]);

  useEffect(() => {
    localStorage.setItem("lastPage", "/relatives/booking");
  }, []);

  return <div>Đang xử lý...</div>;
  // return (
  //   <div>
  //     <Header />
  //     <Hero />
  //     <Footer />
  //   </div>
  // );
};

export default UserPage;
