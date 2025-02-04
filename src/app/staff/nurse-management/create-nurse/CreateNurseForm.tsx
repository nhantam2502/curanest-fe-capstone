"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export interface NurseForStaff {
  id: number;
  name: string;
  status: string;
  major: string;
  dob: string;
  citizen_id: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  gender: string;
  slogan: string;
}

const NurseForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [nurseData, setNurseData] = useState<NurseForStaff>({
    id: 0,
    name: "",
    status: "",
    major: "",
    dob: "",
    citizen_id: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    gender: "",
    slogan: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNurseData((prevData) => ({ ...prevData, [name]: value }));
  };

  const steps = [
    { id: 1, title: "Thông tin cơ bản" },
    { id: 2, title: "Thông tin chi tiết" },
    { id: 3, title: "Thông tin khác" },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={nurseData.name}
              onChange={handleInputChange}
              placeholder="Tên"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="major"
              value={nurseData.major}
              onChange={handleInputChange}
              placeholder="Chuyên môn"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="date"
              name="dob"
              value={nurseData.dob}
              onChange={handleInputChange}
              placeholder="Ngày sinh"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="citizen_id"
              value={nurseData.citizen_id}
              onChange={handleInputChange}
              placeholder="CCCD"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="address"
              value={nurseData.address}
              onChange={handleInputChange}
              placeholder="Địa chỉ"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="ward"
              value={nurseData.ward}
              onChange={handleInputChange}
              placeholder="Phường"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="district"
              value={nurseData.district}
              onChange={handleInputChange}
              placeholder="Quận"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="city"
              value={nurseData.city}
              onChange={handleInputChange}
              placeholder="Thành phố"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="gender"
              value={nurseData.gender}
              onChange={handleInputChange}
              placeholder="Giới tính"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="slogan"
              value={nurseData.slogan}
              onChange={handleInputChange}
              placeholder="Slogan"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800">Thêm điều dưỡng</h1>
      <section className="max-w-6xl mx-auto p-6">
        <div className="flex items-center space-x-6">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-lg">{step.id}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    currentStep >= step.id ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    currentStep > index + 1 ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {renderStepContent()}

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="bg-gray-300 text-white px-6 py-2 rounded-md disabled:bg-gray-500"
          >
            Previous
          </button>
          <button
            onClick={handleNextStep}
            disabled={currentStep === steps.length}
            className="bg-primary text-white px-6 py-2 rounded-md disabled:bg-gray-500"
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
};

export default NurseForm;
