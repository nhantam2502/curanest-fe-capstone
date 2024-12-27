// export type Specialization =
//   | "Chăm sóc bệnh nhân nội khoa"
//   | "Chăm sóc bệnh nhân ngoại khoa"
//   | "Chăm sóc bệnh nhân nhi"
//   | "Chăm sóc bệnh nhân cấp cứu"
//   | "Chăm sóc sức khỏe cộng đồng";

// export type Services = {
//   [key in Specialization]: string[];
// };

// export interface Nurse {
//   id: number;
//   name: string;
//   specialization: Specialization;
//   avgRating: number;
//   totalRating: number;
//   photo: string;
//   totalPatients: number;
//   hospital: string;
//   experience: string;
//   education_level: string;
//   certificate: string[];
//   services: Services;
// }

// export interface DetailNurseProps {
//   nurse: Nurse;
// }


export interface Nurse {
  id: number;
  name: string;
  specialization: string;
  avgRating: number;
  totalRating: number;
  photo: string;
  totalPatients: number;
  hospital: string;
  experience: string; // Kinh nghiệm làm việc
  education_level: string; // Trình độ học vấn
  certificate: string[]; // Danh sách chứng chỉ
}

export interface DetailNurseProps {
  nurse: Nurse;
}
