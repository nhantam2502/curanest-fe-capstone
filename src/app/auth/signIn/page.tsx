"use client";
import { LoginForm } from "@/components/login-form";
import React from "react";
import LeftImage from "../../../../public/hero-bg.png";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center">
      {/* Phần bên trái */}
      <div className="relative w-full lg:w-1/2 h-1/3 lg:h-full flex flex-col">
        <div className="absolute top-[20%] left-[10%] flex flex-col">
          <p className="text_para">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            nam dolorum aliquam, quibusdam aperiam voluptatum.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Phần bên phải */}
      <div className="relative w-full lg:w-1/2 h-full flex flex-col p-6 sm:p-12 lg:p-20 justify-center items-center">
        {/* Hình ảnh nền */}
        <Image
          src={LeftImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        <div className="w-full flex flex-col max-w-md  p-6 rounded-md">
          <div className="w-full flex flex-col mb-4">
            <h3 className="text-2xl sm:text-3xl font-semibold mb-2">
              Đăng nhập
            </h3>
            <p className="text-sm sm:text-base mb-4">
              Chào mừng bạn quay trở lại
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
