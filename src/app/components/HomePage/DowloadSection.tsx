import React from "react";
import { QrCode } from "lucide-react";

const DownloadAppSection = () => {
  return (
    <section className="py-16 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-4">
            <p className="text-lg font-medium text-gray-600 flex-shrink-0">
              Có sẵn trên
            </p>
            <div className="flex items-center gap-2">
              <img src="/apple-icon.svg" alt="Apple" className="w-6 h-6" />
              <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
            </div>
          </div>

          <h2 className="text-4xl font-bold sm:text-5xl text-headingColor">
            Tải về ứng dụng
            <span className="text-[#71DDD7]"> Curanest </span>
          </h2>

          <p className="text-xl text-gray-600">
            Đặt lịch hẹn để nhận dịch vụ chăm sóc sức khỏe tại nhà tận tâm và
            chuyên nghiệp với ứng dụng di động Curanest.
          </p>

          <div data-aos="fade-right">
            <QrCode size={100} />
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-96 h-[600px]">
            <img
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
              src="/mockup.png"
              alt="App Screenshot"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection;
