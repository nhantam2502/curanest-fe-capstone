"use client";
import React, { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ProfileContent = () => {
  const router = useRouter();
  const [relativeInfo, setRelativeInfo] = useState<infoRelatives | null>(null);
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
    city: "Hồ Chí Minh",
    avatar: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const findDistrictByName = (districts: District[], name: string) => {
    return districts.find((d) => d.name === name)?.code.toString();
  };

  // const findWardByName = (wards: Ward[], name: string) => {
  //   return wards.find((w) => w.name === name)?.code.toString();
  // };

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

  useEffect(() => {
    const loadWardData = async () => {
      if (selectedDistrict && relativeInfo?.ward) {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
          );
          const data = await response.json();
          setWards(data.wards || []);

          // Sau khi có danh sách phường, tìm và set lại mã phường
          const wardCode = data.wards
            .find((w: Ward) => w.name === relativeInfo.ward)
            ?.code.toString();

          if (wardCode) {
            setFormData((prev) => ({
              ...prev,
              ward: wardCode,
            }));
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      }
    };

    loadWardData();
  }, [selectedDistrict, relativeInfo?.ward]);

  // Fetch relative info from the API
  useEffect(() => {
    const fetchRelativeInfo = async () => {
      try {
        const response = await patientApiRequest.getInfoRelatives();
        setRelativeInfo(response.payload.data);
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
        city: relativeInfo.city || "Hồ Chí Minh",
        avatar: relativeInfo.avatar || "",
      });
    }
  }, [relativeInfo]);

  useEffect(() => {
    if (relativeInfo && districts.length > 0) {
      const districtCode = findDistrictByName(districts, relativeInfo.district);
      if (districtCode) {
        setFormData((prev) => ({
          ...prev,
          district: districtCode,
        }));
        setSelectedDistrict(districtCode);
      }
    }
  }, [relativeInfo, districts]);

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
        avatar: formData.avatar,
      });

      console.log("Update relative info response:", response);

      // Cập nhật local state với cả mã code và tên
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

      // Giữ nguyên giá trị của formData sau khi submit
      setFormData((prev) => ({
        ...prev,
        district: formData.district,
        ward: formData.ward,
      }));

      setSelectedDistrict(formData.district);
      toast({
        variant: "default",
        title: "Cập nhật thành công",
        description: "Thông tin người dùng đã được cập nhật.",
        duration: 2000,
      });
      router.push("/relatives/booking");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!relativeInfo) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#FEFEFE] to-[#FEF0D7] bg-opacity-50 z-50">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-[#A8E0E9] opacity-30 animate-pulse"></div>
            <Loader2
              className="h-12 w-12 animate-spin text-[#64D1CB]"
              aria-label="Loading..."
            />
          </div>
          <div className="text-[#64D1CB] text-sm font-medium mt-4 animate-fade-in">
            Đang tải...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12">
      <h2 className="text-4xl font-semibold mb-12">Thông tin người dùng</h2>
      <form onSubmit={handleSubmit}>
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
                />
              </div>
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-3">
                  Ngày tháng năm sinh
                </label>
                <input
                  type="date"
                  name="dob"
                  className="w-full p-4 border rounded-lg text-xl"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-4 border rounded-lg text-xl"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-3">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="w-full p-4 border rounded-lg text-xl"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
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
                  name="address"
                  className="w-full p-4 border rounded-lg text-xl"
                  value={formData.address}
                  onChange={handleInputChange}
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
                  disabled
                  defaultValue={formData.city}
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
      </form>
    </div>
  );
};

export default ProfileContent;
