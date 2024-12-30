import React from "react";

const DownloadAppSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between bg-white p-6 lg:p-12 space-y-6 lg:space-y-0 lg:space-x-12">
      {/* Left Section */}
      <div className="flex flex-col items-center lg:items-start">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-gray-500">Có sẵn trên</span>
          <img
            src="/apple-logo.png"
            alt="Apple Store"
            className="h-4"
          />
          <img
            src="/google-logo.png"
            alt="Google Play"
            className="h-4"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-center lg:text-left">
          Tải về ứng dụng Fresha
        </h1>
        <p className="text-gray-600 text-center lg:text-left">
          Đặt lịch hẹn để có những trải nghiệm làm đẹp và chăm sóc sức khỏe khó quên với ứng dụng di động Fresha.
        </p>
        <div className="mt-6">
          <img
            src="/qr-code.png"
            alt="QR Code"
            className="h-32 w-32 border rounded-md"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex space-x-4">
        {/* Phone Screen 1 */}
        <div className="w-60 h-auto border rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://www.fresha.com/assets/_next/static/images/trendyStudio@2x-7323de5d66a7e52fa30aab8711abf488.webp"
            alt="App Screen 1"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Phone Screen 2 */}
        <div className="w-60 h-auto border rounded-lg shadow-lg overflow-hidden">
          <img
            src="/phone-screen-2.png"
            alt="App Screen 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadAppSection;
