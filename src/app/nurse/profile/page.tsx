"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ProfileData } from "@/types/nurse";

const initialProfileData = {
  personal_info: {
    full_name: "Nguyễn Thị Ánh Ngọc",
    avatar_url: "/placeholder.png",
    dob: "15/08/1990",
    gender: "Nữ",
    slogan: "Tận tâm chăm sóc - Nâng niu sức khỏe",
    about:
      "Với hơn 10 năm kinh nghiệm trong lĩnh vực điều dưỡng, tôi luôn đặt sự an toàn và thoải mái của người bệnh lên hàng đầu. Không ngừng học hỏi và cập nhật kiến thức y khoa để nâng cao chất lượng chăm sóc.",
  },
  professional_info: {
    position: "Điều dưỡng viên hạng III",
    department: "Khoa Nội Tim mạch",
    workplace: "Bệnh viện Đa khoa Thành phố",
    medical_license: "012345/BYT-CCHN",
    specializations: ["Điều dưỡng Nội khoa", "Chăm sóc đặc biệt"],
  },
  contact_info: {
    phone: "0912.345.678",
    email: "anhngoc.nurse@hospital.com",
    citizen_id: "079190123456",
    address: {
      street: "123 Đường Lê Lợi",
      ward: "Phường Bến Nghé",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
    },
  },
  skills_languages: {
    skills: [
      "Chăm sóc bệnh nhân cấp cứu",
      "Quản lý thuốc và điều trị",
      "Theo dõi dấu hiệu sinh tồn",
      "Thực hiện thủ thuật y tế",
      "Sử dụng trang thiết bị y tế",
      "Ghi chép bệnh án điện tử",
    ]
  },
  experience: [
    {
      position: "Điều dưỡng viên hạng III",
      department: "Khoa Nội Tim mạch",
      workplace: "Bệnh viện Đa khoa Thành phố",
      duration: "2018 - Hiện tại",
      responsibilities: [
        "Chăm sóc và theo dõi bệnh nhân tim mạch",
        "Quản lý thuốc và điều trị theo chỉ định",
        "Đào tạo điều dưỡng mới",
        "Lập kế hoạch chăm sóc cho bệnh nhân",
      ],
    },
    {
      position: "Điều dưỡng viên hạng IV",
      department: "Khoa Cấp cứu",
      workplace: "Bệnh viện Đa khoa Tỉnh",
      duration: "2012 - 2018",
      responsibilities: [
        "Sơ cứu và chăm sóc bệnh nhân cấp cứu",
        "Hỗ trợ bác sĩ trong các thủ thuật",
        "Theo dõi và ghi chép bệnh án",
      ],
    },
  ],
  education: [
    {
      degree: "Thạc sĩ Điều dưỡng",
      major: "Điều dưỡng",
      university: "Đại học Y Dược TP.HCM",
      duration: "2016 - 2018",
    },
    {
      degree: "Cử nhân Điều dưỡng",
      major: "Điều dưỡng",
      university: "Đại học Y Dược TP.HCM",
      duration: "2008 - 2012",
    },
  ],
  certificates: [
    {
      name: "Chứng chỉ Hồi sức cấp cứu",
      issuer: "Bệnh viện Chợ Rẫy",
      year: "2020",
      expiry: "2025",
    },
    {
      name: "Chứng chỉ Điều dưỡng chuyên khoa Tim mạch",
      issuer: "Bệnh viện Tim Hà Nội",
      year: "2019",
      expiry: "2024",
    },
  ],
};

export default function NurseProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] =
    useState<ProfileData>(initialProfileData);

  const handleInputChange = <T extends keyof ProfileData>(
    section: T,
    field: keyof ProfileData[T],
    value: any,
    setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = <T extends keyof ProfileData>(
    section: T,
    parentField: keyof ProfileData[T],
    field: string,
    value: string,
    setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...prev[section][parentField],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileData.personal_info.avatar_url} />
              <AvatarFallback>
                {profileData.personal_info.full_name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {profileData.personal_info.full_name}
              </h1>
              <p className="text-gray-600 mb-1">
                {profileData.professional_info.position}
              </p>
              <p className="text-gray-500 text-sm">
                {profileData.professional_info.department}
              </p>
              <p className="text-gray-500 text-sm">
                {profileData.professional_info.workplace}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "destructive" : "default"}
          >
            {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
          </Button>
        </div>
        <div className="mt-4">
          <p className="text-gray-600 italic">
            {profileData.personal_info.slogan}
          </p>
        </div>
      </div>

      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
          <TabsTrigger value="about">Thông tin</TabsTrigger>
          <TabsTrigger value="experience">Kinh nghiệm</TabsTrigger>
          <TabsTrigger value="education">Học vấn</TabsTrigger>
          <TabsTrigger value="certificates">Chứng chỉ</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Thông tin cá nhân
                </h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Họ và tên</label>
                      <Input
                        value={profileData.personal_info.full_name}
                        onChange={(e) =>
                          handleInputChange(
                            "personal_info",
                            "full_name",
                            e.target.value,
                            setProfileData
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ngày sinh</label>
                      <Input
                        value={profileData.personal_info.dob}
                        onChange={(e) =>
                          handleInputChange(
                            "personal_info",
                            "dob",
                            e.target.value,
                            setProfileData
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Giới tính</label>
                      <Input
                        value={profileData.personal_info.gender}
                        onChange={(e) =>
                          handleInputChange(
                            "personal_info",
                            "gender",
                            e.target.value,
                            setProfileData
                          )
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Ngày sinh:</span>{" "}
                      {profileData.personal_info.dob}
                    </p>
                    <p>
                      <span className="font-medium">Giới tính:</span>{" "}
                      {profileData.personal_info.gender}
                    </p>
                    <p>
                      <span className="font-medium">CCCD:</span>{" "}
                      {profileData.contact_info.citizen_id}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Thông tin liên hệ
                </h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Số điện thoại
                      </label>
                      <Input
                        value={profileData.contact_info.phone}
                        onChange={(e) =>
                          handleInputChange(
                            "contact_info",
                            "phone",
                            e.target.value,
                            setProfileData
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        value={profileData.contact_info.email}
                        onChange={(e) =>
                          handleInputChange(
                            "contact_info",
                            "email",
                            e.target.value,
                            setProfileData
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Địa chỉ</label>
                      <Input
                        value={profileData.contact_info.address.street}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "contact_info",
                            "address",
                            "street",
                            e.target.value,
                            setProfileData
                          )
                        }
                        className="mb-2"
                      />
                      <Input
                        value={profileData.contact_info.address.ward}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "contact_info",
                            "address",
                            "ward",
                            e.target.value,
                            setProfileData
                          )
                        }
                        className="mb-2"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={profileData.contact_info.address.district}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "contact_info",
                              "address",
                              "district",
                              e.target.value,
                              setProfileData
                            )
                          }
                        />
                        <Input
                          value={profileData.contact_info.address.city}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "contact_info",
                              "address",
                              "city",
                              e.target.value,
                              setProfileData
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {profileData.contact_info.phone}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {profileData.contact_info.email}
                    </p>
                    <p>
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      {`${profileData.contact_info.address.street}, ${profileData.contact_info.address.ward}, ${profileData.contact_info.address.district}, ${profileData.contact_info.address.city}`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Kỹ năng & Chuyên môn
                </h2>
                <div className="space-y-4">
                  <h3 className="font-medium mb-2 text-lg">Kỹ năng</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills_languages.skills.map((skill, index) => (
                      <Badge
                        className="text-sm"
                        key={index}
                        variant="secondary"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Kinh nghiệm làm việc
              </h2>
              <div className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-gray-200 pl-4 py-2"
                  >
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Vị trí</label>
                          <Input
                            value={exp.position}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedExperience = [...prev.experience];
                                updatedExperience[index].position =
                                  e.target.value;
                                return {
                                  ...prev,
                                  experience: updatedExperience,
                                };
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Đơn vị làm việc
                          </label>
                          <Input
                            value={exp.workplace}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedExperience = [...prev.experience];
                                updatedExperience[index].workplace =
                                  e.target.value;
                                return {
                                  ...prev,
                                  experience: updatedExperience,
                                };
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Khoa</label>
                          <Input
                            value={exp.department}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedExperience = [...prev.experience];
                                updatedExperience[index].department =
                                  e.target.value;
                                return {
                                  ...prev,
                                  experience: updatedExperience,
                                };
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Thời gian
                          </label>
                          <Input
                            value={exp.duration}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedExperience = [...prev.experience];
                                updatedExperience[index].duration =
                                  e.target.value;
                                return {
                                  ...prev,
                                  experience: updatedExperience,
                                };
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Trách nhiệm
                          </label>
                          <Textarea
                            value={exp.responsibilities.join("\n")}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedExperience = [...prev.experience];
                                updatedExperience[index].responsibilities =
                                  e.target.value.split("\n");
                                return {
                                  ...prev,
                                  experience: updatedExperience,
                                };
                              })
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium">
                              {exp.position}
                            </h3>
                            <p className="text-gray-600">{exp.workplace}</p>
                            <p className="text-gray-500 text-sm">
                              {exp.department}
                            </p>
                          </div>
                          <Badge variant="outline">{exp.duration}</Badge>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx} className="text-gray-600 text-sm">
                              • {resp}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <Button
                  onClick={() =>
                    setProfileData((prev) => ({
                      ...prev,
                      experience: [
                        ...prev.experience,
                        {
                          position: "",
                          department: "",
                          workplace: "",
                          duration: "",
                          responsibilities: [],
                        },
                      ],
                    }))
                  }
                  className="mt-4"
                >
                  Thêm Kinh Nghiệm
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {profileData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-gray-200 pl-4 py-2 space-y-2"
                  >
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Học vị</label>
                          <Input
                            value={edu.degree}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedEducation = [...prev.education];
                                updatedEducation[index].degree = e.target.value;
                                return { ...prev, education: updatedEducation };
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Ngành</label>
                          <Input
                            value={edu.major}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedEducation = [...prev.education];
                                updatedEducation[index].major = e.target.value;
                                return { ...prev, education: updatedEducation };
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Trường đại học
                          </label>
                          <Input
                            value={edu.university}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedEducation = [...prev.education];
                                updatedEducation[index].university =
                                  e.target.value;
                                return { ...prev, education: updatedEducation };
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Thời gian
                          </label>
                          <Input
                            value={edu.duration}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedEducation = [...prev.education];
                                updatedEducation[index].duration =
                                  e.target.value;
                                return { ...prev, education: updatedEducation };
                              })
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-medium">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.major}</p>
                        <p className="text-gray-500">{edu.university}</p>
                        <p className="text-gray-500 text-sm">{edu.duration}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Chứng chỉ</h2>
              <div className="space-y-6">
                {profileData.certificates.map((cert, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            Tên chứng chỉ
                          </label>
                          <Input
                            value={cert.name}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedCertificates = [
                                  ...prev.certificates,
                                ];
                                updatedCertificates[index].name =
                                  e.target.value;
                                return {
                                  ...prev,
                                  certificates: updatedCertificates,
                                };
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Cơ quan cấp
                          </label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) =>
                              setProfileData((prev) => {
                                const updatedCertificates = [
                                  ...prev.certificates,
                                ];
                                updatedCertificates[index].issuer =
                                  e.target.value;
                                return {
                                  ...prev,
                                  certificates: updatedCertificates,
                                };
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">
                              Năm cấp
                            </label>
                            <Input
                              value={cert.year}
                              onChange={(e) =>
                                setProfileData((prev) => {
                                  const updatedCertificates = [
                                    ...prev.certificates,
                                  ];
                                  updatedCertificates[index].year =
                                    e.target.value;
                                  return {
                                    ...prev,
                                    certificates: updatedCertificates,
                                  };
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Ngày hết hạn
                            </label>
                            <Input
                              value={cert.expiry}
                              onChange={(e) =>
                                setProfileData((prev) => {
                                  const updatedCertificates = [
                                    ...prev.certificates,
                                  ];
                                  updatedCertificates[index].expiry =
                                    e.target.value;
                                  return {
                                    ...prev,
                                    certificates: updatedCertificates,
                                  };
                                })
                              }
                            />
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            setProfileData((prev) => {
                              const updatedCertificates = [
                                ...prev.certificates,
                              ];
                              updatedCertificates.splice(index, 1);
                              return {
                                ...prev,
                                certificates: updatedCertificates,
                              };
                            })
                          }
                        >
                          Xóa chứng chỉ
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-medium">{cert.name}</h3>
                        <p className="text-gray-600">{cert.issuer}</p>
                        <p className="text-gray-500 text-sm">
                          Năm cấp: {cert.year} - Hết hạn: {cert.expiry}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button
                    onClick={() =>
                      setProfileData((prev) => ({
                        ...prev,
                        certificates: [
                          ...prev.certificates,
                          { name: "", issuer: "", year: "", expiry: "" },
                        ],
                      }))
                    }
                  >
                    Thêm chứng chỉ mới
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isEditing && (
        <div className="fixed bottom-6 right-6">
          <Button
            size="lg"
            onClick={() => setIsEditing(false)}
            className="shadow-lg"
          >
            Lưu thay đổi
          </Button>
        </div>
      )}
    </div>
  );
}
