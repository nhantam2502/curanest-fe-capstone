"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import users from "@/dummy_data/dummy_user_list.json";
import { User } from "../UserTable";
import { Button } from "@/components/ui/button";


export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!id) return;
    const foundUser = users.find((u) => u.id === Number(id));
    setUser(foundUser || null);
  }, [id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-2xl font-bold">
              Thông tin chi tiết
            </h1>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/user")}>
          Trở về
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <span className="font-medium">Họ:</span>
            <span> {user.last_name}</span>
          </div>
          <div>
            <span className="font-medium">Tên:</span>
            <span> {user.first_name}</span>
          </div>
          <div>
            <span className="font-medium">Ngày sinh:</span>
            <span> {user.dob}</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Địa chỉ</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <span className="font-medium">Thành phố:</span>
            <span> {user.city}</span>
          </div>
          <div>
            <span className="font-medium">Quận:</span>
            <span> {user.district}</span>
          </div>
          <div>
            <span className="font-medium">Phường:</span>
            <span> {user.ward}</span>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <span className="font-medium">Email:</span>
            <span> {user.email}</span>
          </div>
          <div>
            <span className="font-medium">SĐT:</span>
            <span> {user.phone_number}</span>
          </div>
          <div>
            <span className="font-medium">Địa chỉ:</span>
            <span> {user.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
