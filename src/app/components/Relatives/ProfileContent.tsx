"use client";
import React, { useState, useEffect } from "react";
import { User, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfileContent = () => {
  const [relativeInfo, setRelativeInfo] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [gender, setGender] = useState<string>(""); // State for gender

  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [formData, setFormData] = useState({
    district: "",
    ward: "",
  });

  // Fetch relative info and district data
  useEffect(() => {
    const fetchRelativeInfo = async () => {
      try {
        const response = await patientApiRequest.infoRelatives();
        setRelativeInfo(response.payload.data);
        setAvatar(response.payload.data.avatar || "default-avatar-url");
        setGender(response.payload.data.gender || "");
      } catch (error) {
        console.error("Error fetching relative info:", error);
      }
    };

    fetchRelativeInfo();
  }, []);

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

  // Fetch relative info from the API
  useEffect(() => {
    const fetchRelativeInfo = async () => {
      try {
        const response = await patientApiRequest.infoRelatives();
        setRelativeInfo(response.payload.data);
        setAvatar(response.payload.data.avatar || "default-avatar-url");
        setGender(response.payload.data.gender || ""); // Set gender from fetched data
      } catch (error) {
        console.error("Error fetching relative info:", error);
      }
    };

    fetchRelativeInfo();
  }, []);

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value); // Update selected district
    setFormData((prev) => ({
      ...prev,
      district: value,
      ward: "", // Reset ward when district changes
    }));
  };

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

  if (!relativeInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-12">
      <h2 className="text-4xl font-semibold mb-12">Thông tin người dùng</h2>
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
                  className="w-full p-4 border rounded-lg text-xl"
                  defaultValue={relativeInfo.full_name}
                />
              </div>
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-3">
                  Ngày sinh
                </label>
                <input
                  type="text"
                  className="w-full p-4 border rounded-lg text-xl"
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
                  defaultValue={relativeInfo.phone_number}
                />
              </div>

              {/* Gender Field */}
              <div className="space-y-2">
                <Label className="text-xl" htmlFor="gender">
                  Giới tính
                </Label>
                <Select
                  value={relativeInfo.gender ? "true" : "false"}
                  onValueChange={(value) => setGender(value)}
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
                  defaultValue={relativeInfo.address}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xl" htmlFor="district">
                  Quận
                </Label>
                <Select
                  defaultValue={relativeInfo.district}
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
                />
              </div>
            </div>
          </div>

          <button className="bg-yellowColor text-white px-8 py-4 rounded-lg hover:bg-[#e5ab47] text-xl w-full">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
