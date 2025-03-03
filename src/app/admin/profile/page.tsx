"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileData {
  name: string;
  email: string;
  jobTitle: string;
  about: string;
  phone: string;
  location: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    years: string;
    description: string;
  }[];
  education: {
    degree: string;
    university: string;
    years: string;
  }[];
}

const initialProfileData: ProfileData = {
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@example.com",
  jobTitle: "Registered Nurse",
  about:
    "Experienced and compassionate registered nurse with over 7 years of experience providing high-quality patient care in various settings, including hospitals, clinics, and home healthcare. Dedicated to continuous learning and professional development to stay abreast of the latest advancements in medical practices and technologies.",
  phone: "(123) 456-7890",
  location: "Los Angeles, CA",
  skills: ["Patient Care", "Wound Care", "IV Therapy", "CPR/BLS", "Medication Administration", "Electronic Health Records (EHR)", "Team Leadership"],
  experience: [
    {
      title: "Registered Nurse",
      company: "UCLA Medical Center",
      years: "2019 - Present",
      description:
        "Provide direct patient care in a fast-paced hospital setting. Administer medications, monitor patient conditions, and educate patients and their families.",
    },
    {
      title: "Clinic Nurse",
      company: "Beverly Hills Medical Clinic",
      years: "2017 - 2019",
      description:
        "Assisted physicians with patient examinations, managed patient records, and coordinated patient care with other healthcare professionals.",
    },
  ],
  education: [
    {
      degree: "Master of Science in Nursing (MSN)",
      university: "University of California, Los Angeles",
      years: "2015 - 2017",
    },
    {
      degree: "Bachelor of Science in Nursing (BSN)",
      university: "California State University, Long Beach",
      years: "2011 - 2015",
    },
  ],
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | string[]
  ) => {
    setProfileData({
      ...profileData,
      [field]: value,
    });
  };

  const handleExperienceChange = (
    index: number,
    field: keyof (typeof profileData.experience)[0],
    value: string
  ) => {
    const updatedExperience = [...profileData.experience];
    updatedExperience[index][field] = value;
    setProfileData({
      ...profileData,
      experience: updatedExperience,
    });
  };

  const handleEducationChange = (
    index: number,
    field: keyof (typeof profileData.education)[0],
    value: string
  ) => {
    const updatedEducation = [...profileData.education];
    updatedEducation[index][field] = value;
    setProfileData({
      ...profileData,
      education: updatedEducation,
    });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  return (
    <div className="p-4 min-h-screen">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder.png" alt={profileData.name} />
              <AvatarFallback>
                {profileData.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              <p className="text-gray-500">{profileData.email}</p>
              <p className="text-gray-500 mt-1">{profileData.jobTitle}</p>
            </div>
          </div>
          <div className="">
            <Button variant="outline" onClick={toggleEditMode}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          {isEditing ? (
            <Textarea
              value={profileData.about}
              onChange={(e) =>
                handleInputChange("about", e.target.value)
              }
              className="w-full"
            />
          ) : (
            <p className="text-gray-700">{profileData.about}</p>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <span className="font-medium">Email:</span>
              {isEditing ? (
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                />
              ) : (
                <span> {profileData.email}</span>
              )}
            </div>
            <div>
              <span className="font-medium">Phone:</span>
              {isEditing ? (
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    handleInputChange("phone", e.target.value)
                  }
                />
              ) : (
                <span> {profileData.phone}</span>
              )}
            </div>
            <div>
              <span className="font-medium">Location:</span>
              {isEditing ? (
                <Input
                  value={profileData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              ) : (
                <span> {profileData.location}</span>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          {isEditing ? (
            <Select
              value={profileData.skills.join(',')}
              onValueChange={(value: string) =>
                handleInputChange("skills", value.split(','))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select skills" />
              </SelectTrigger>
              <SelectContent>
                {/* Replace with your actual skill options */}
                <SelectItem value="Patient Care">Patient Care</SelectItem>
                <SelectItem value="Wound Care">Wound Care</SelectItem>
                <SelectItem value="IV Therapy">IV Therapy</SelectItem>
                <SelectItem value="CPR/BLS">CPR/BLS</SelectItem>
                <SelectItem value="Medication Administration">Medication Administration</SelectItem>
                <SelectItem value="Electronic Health Records (EHR)">Electronic Health Records (EHR)</SelectItem>
                <SelectItem value="Team Leadership">Team Leadership</SelectItem>
                {/* Add more skill options as needed */}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Experience Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Experience</h2>
          {isEditing ? (
            <div className="space-y-4">
              {profileData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 pl-4 space-y-2">
                  <Input
                    value={exp.title}
                    onChange={(e) =>
                      handleExperienceChange(index, "title", e.target.value)
                    }
                    placeholder="Job Title"
                  />
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      handleExperienceChange(index, "company", e.target.value)
                    }
                    placeholder="Company"
                  />
                  <Input
                    value={exp.years}
                    onChange={(e) =>
                      handleExperienceChange(index, "years", e.target.value)
                    }
                    placeholder="Years"
                  />
                  <Textarea
                    value={exp.description}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {profileData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 pl-4">
                  <h3 className="text-lg font-medium">{exp.title}</h3>
                  <p className="text-gray-500">{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.years}</p>
                  <ul className="list-disc list-inside mt-2 text-gray-700">
                    {exp.description.split('.').map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          {isEditing ? (
            <div className="space-y-4">
              {profileData.education.map((edu, index) => (
                <div key={index} className="border-l-2 pl-4 space-y-2">
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    placeholder="Degree"
                  />
                  <Input
                    value={edu.university}
                    onChange={(e) =>
                      handleEducationChange(index, "university", e.target.value)
                    }
                    placeholder="University"
                  />
                  <Input
                    value={edu.years}
                    onChange={(e) =>
                      handleEducationChange(index, "years", e.target.value)
                    }
                    placeholder="Years"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {profileData.education.map((edu, index) => (
                <div key={index} className="border-l-2 pl-4">
                  <h3 className="text-lg font-medium">{edu.degree}</h3>
                  <p className="text-gray-500">{edu.university}</p>
                  <p className="text-sm text-gray-500">{edu.years}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-8">
            <Button onClick={handleSaveProfile}>Save Profile</Button>
          </div>
        )}
      </div>
    </div>
  );
}