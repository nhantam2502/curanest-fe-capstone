"use client";
import React, { useState, useEffect } from "react";
import { User, Pencil } from "lucide-react";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { infoRelatives } from "@/types/patient";
import { District, Ward } from "./EditPatientRecord";

const ProfileContent = () => {
  const [relativeInfo, setRelativeInfo] = useState<infoRelatives | null>(null);
  const [avatar, setAvatar] = useState("");
  const [gender, setGender] = useState<string>(""); // State for gender
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    phoneNumber: "",
    gender: "",
    address: "",
    district: "",
    ward: "",
    city: "",
    avatar: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const findDistrictByName = (districts: District[], name: string) => {
    return districts.find((d) => d.name === name)?.code.toString();
  };

  const findWardByName = (wards: Ward[], name: string) => {
    return wards.find((w) => w.name === name)?.code.toString();
  };

  // Fetch districts when component mounts
  useEffect(() => {
    const fetchDistricts = async () => {
      setIsLoadingDistricts(true);
      try {
        const hcmCode = 79; // Code for Hồ Chí Minh City
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${hcmCode}?depth=2`
        );
        const data = await response.json();
        setDistricts(data.districts || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, []);

  useEffect(() => {
    if (!isLoadingDistricts && districts.length > 0 && relativeInfo?.district) {
      const districtCode = findDistrictByName(districts, relativeInfo.district);
      if (districtCode) {
        setFormData((prev) => ({
          ...prev,
          district: districtCode,
        }));
        setSelectedDistrict(districtCode);
      }
    }
  }, [isLoadingDistricts, districts, relativeInfo?.district]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) {
        setWards([]);
        return;
      }

      setIsLoadingWards(true);
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
        );
        const data = await response.json();
        setWards(data.wards || []);
      } catch (error) {
        console.error("Error fetching wards:", error);
      } finally {
        setIsLoadingWards(false);
      }
    };

    fetchWards();
  }, [selectedDistrict]);

  useEffect(() => {
    if (wards.length > 0 && relativeInfo?.ward) {
      const wardCode = findWardByName(wards, relativeInfo.ward);
      if (wardCode) {
        setFormData((prev) => ({
          ...prev,
          ward: wardCode,
        }));
      }
    }
  }, [wards, relativeInfo?.ward]);

  // Fetch relative info from the API
  useEffect(() => {
    const fetchRelativeInfo = async () => {
      try {
        const response = await patientApiRequest.getInfoRelatives();
        setRelativeInfo(response.payload.data);
        setAvatar(response.payload.data.avatar || "default-avatar-url");
        setGender(response.payload.data.gender || "");
      } catch (error) {
        console.error("Error fetching relative info:", error);
      }
    };

    fetchRelativeInfo();
  }, []);

  // Update form data when relative info is loaded
  useEffect(() => {
    if (relativeInfo) {
      setFormData({
        fullName: relativeInfo["full-name"] || "",
        dob: relativeInfo.dob || "",
        email: relativeInfo.email || "",
        phoneNumber: relativeInfo["phone-number"] || "",
        gender: relativeInfo.gender ? "true" : "false",
        address: relativeInfo.address || "",
        district: relativeInfo.district || "",
        ward: relativeInfo.ward || "",
        city: relativeInfo.city || "",
        avatar: relativeInfo.avatar || "",
      });
    }
  }, [relativeInfo]);

  // Handle gender change
  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  // Handle district change
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setFormData((prev) => ({
      ...prev,
      district: value,
      ward: "",
    }));
  };

  // Handle ward change
  const handleWardChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      ward: value,
    }));
  };

  // Handle the avatar click event to trigger file input
  const handleAvatarClick = () => {
    document.getElementById("avatar-upload")?.click();
  };

  // Handle file selection and update avatar
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!relativeInfo) {
      console.error("Relative info is not loaded");
      setIsSubmitting(false);
      return;
    }

    try {
      const selectedDistrictName = districts.find(
        (d) => d.code.toString() === formData.district
      )?.name;

      const selectedWardName = wards.find(
        (w) => w.code.toString() === formData.ward
      )?.name;

      const response = await patientApiRequest.updateInfoRelatives({
        id: relativeInfo.id,
        "full-name": formData.fullName,
        dob: formData.dob,
        email: formData.email,
        "phone-number": formData.phoneNumber,
        gender: formData.gender === "true",
        address: formData.address,
        district: selectedDistrictName || "",
        ward: selectedWardName || "",
        city: formData.city,
        avatar: formData.avatar
            });
  

      // Update local state
      setRelativeInfo((prev) =>
        prev
          ? {
              ...prev,
              "full-name": formData.fullName,
              dob: formData.dob,
              email: formData.email,
              "phone-number": formData.phoneNumber,
              gender: formData.gender === "true",
              address: formData.address,
              district: selectedDistrictName || "",
              ward: selectedWardName || "",
              city: formData.city,
            }
          : null
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!relativeInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-12">
      <h2 className="text-4xl font-semibold mb-12">Thông tin người dùng</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-12">
          {/* Avatar section */}
          <div className="w-80 flex flex-col items-center space-y-6">
            <div className="relative group">
              <img
                src={avatar}
                alt="Profile"
                className="w-64 h-64 rounded-full object-cover border-6 border-violet-100 cursor-pointer"
              />
              <div
                className="absolute bottom-4 right-4 p-2 bg-yellowColor rounded-full cursor-pointer transition-colors group-hover:scale-110"
                onClick={handleAvatarClick}
              >
                <Pencil className="w-6 h-6 text-white" />
              </div>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Form section */}
          <div className="flex-1 space-y-8">
            {/* Personal Information */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-3xl font-semibold mb-6">Thông tin cá nhân</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="w-full p-4 border rounded-lg text-xl"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    defaultValue={relativeInfo["full-name"]}
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Ngày tháng năm sinh
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg text-xl"
                    value={formData.dob}
                    onChange={handleInputChange}
                    defaultValue={relativeInfo.dob}
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-4 border rounded-lg text-xl"
                    value={formData.email}
                    onChange={handleInputChange}
                    defaultValue={relativeInfo.email}
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full p-4 border rounded-lg text-xl"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    defaultValue={relativeInfo["phone-number"]}
                  />
                </div>

                {/* Gender Field */}
                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="gender">
                    Giới tính
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={handleGenderChange}
                  >
                    <SelectTrigger className="h-12 w-full text-xl">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="text-lg" value="true">
                        Nam
                      </SelectItem>
                      <SelectItem className="text-lg" value="false">
                        Nữ
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-3xl font-semibold mb-6">Địa chỉ liên lạc</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg text-xl"
                    value={formData.address}
                    onChange={handleInputChange}
                    defaultValue={relativeInfo.address}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="district">
                    Quận
                  </Label>
                  <Select
                    value={formData.district}
                    onValueChange={handleDistrictChange}
                    disabled={isLoadingDistricts}
                  >
                    <SelectTrigger className="h-12 w-full text-xl">
                      <SelectValue
                        placeholder={
                          isLoadingDistricts ? "Đang tải..." : "Chọn quận"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem
                          key={district.code}
                          value={district.code.toString()}
                          className="text-lg"
                        >
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="ward">
                    Phường
                  </Label>
                  <Select
                    value={formData.ward}
                    onValueChange={handleWardChange}
                    disabled={!formData.district || isLoadingWards}
                  >
                    <SelectTrigger className="h-12 w-full text-xl">
                      <SelectValue
                        placeholder={
                          isLoadingWards ? "Đang tải..." : "Chọn phường"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem
                          key={ward.code}
                          value={ward.code.toString()}
                          className="text-lg"
                        >
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Tỉnh/Thành phố
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg text-xl"
                    defaultValue={relativeInfo.city}
                    disabled
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-yellowColor text-white px-8 py-4 rounded-lg hover:bg-[#e5ab47] text-xl w-full"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileContent;
