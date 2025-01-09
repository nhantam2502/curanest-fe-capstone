"use client";
import React, { useState } from "react";
import {
  CreditCard,
  User,
  Lock,
  ArrowUpCircle,
  ArrowDownCircle,
  Pencil,
} from "lucide-react";
import { useSession } from "next-auth/react";

const dummyProfile = {
  email: "nguyenvana@gmail.com",
  avatar: "https://github.com/shadcn.png",
  full_name: "Nguyễn Văn A",
  phone_number: "0923456789",
  dob: "01/01/1990",
  ward: "Phường 12",
  district: "Quận Bình Thạnh",
  city: "TP. Hồ Chí Minh",
  address: "123 Đường Nguyễn Văn Linh",
};

const dummyTransactions = [
  {
    id: 1,
    type: "deposit",
    amount: 500000,
    description: "Nạp tiền qua Momo",
    date: "2024-01-09 14:30",
  },
  {
    id: 2,
    type: "withdraw",
    amount: 200000,
    description: "Thanh toán đơn hàng #HD001",
    date: "2024-01-08 09:15",
  },
  {
    id: 3,
    type: "deposit",
    amount: 1000000,
    description: "Nạp tiền qua ngân hàng",
    date: "2024-01-07 16:45",
  },
  {
    id: 4,
    type: "withdraw",
    amount: 150000,
    description: "Thanh toán đơn hàng #HD002",
    date: "2024-01-06 11:20",
  },
  {
    id: 5,
    type: "deposit",
    amount: 300000,
    description: "Nạp tiền qua Zalopay",
    date: "2024-01-05 13:50",
  },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("wallet");
  const { data: session, status } = useSession();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "đ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  const menuItems = [
    {
      id: "profile",
      label: "Thông tin người dùng",
      icon: <User className="w-6 h-6" />,
    },
    {
      id: "wallet",
      label: "Ví tiền",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      id: "password",
      label: "Thay đổi mật khẩu",
      icon: <Lock className="w-6 h-6" />,
    },
  ];

  const WalletContent = () => (
    <div className="p-8">
      <h2 className="text-4xl font-semibold mb-8">Ví tiền</h2>
      <div className="bg-gradient-to-r from-blue-300 to-yellow-300 rounded-xl p-8 text-white mb-8">
        <div className="text-7xl font-bold mb-4">0đ</div>
        <div className="text-2xl mb-6">Số dư ví</div>
        <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition text-xl">
          Nạp tiền vào ví
        </button>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <h3 className="text-3xl font-semibold mb-6">Lịch sử giao dịch</h3>
        <div className="space-y-4">
          {dummyTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-4">
                {transaction.type === "deposit" ? (
                  <ArrowUpCircle className="w-10 h-10 text-green-500" />
                ) : (
                  <ArrowDownCircle className="w-10 h-10 text-red-500" />
                )}
                <div>
                  <div className="font-medium text-xl">
                    {transaction.description}
                  </div>
                  <div className="text-lg text-gray-500">
                    {formatDate(transaction.date)}
                  </div>
                </div>
              </div>
              <div
                className={`text-xl font-semibold ${
                  transaction.type === "deposit"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "deposit" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProfileContent = () => {
    // Assuming `dummyProfile` is being passed as a prop or is available in state.
    const [avatar, setAvatar] = useState(dummyProfile.avatar);

    // Handle the avatar click event to trigger file input
    const handleAvatarClick = () => {
      document.getElementById("avatar-upload")?.click();
    };

    // Handle file selection and update avatar
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Create a temporary URL for the selected file
        const imageUrl = URL.createObjectURL(file);
        setAvatar(imageUrl); // Update avatar state with the new image URL
        console.log("Selected file:", file);
      }
    };

    return (
      <div className="p-12">
        <h2 className="text-4xl font-semibold mb-12">Thông tin người dùng</h2>
        <div className="flex gap-12 ">
          {/* Avatar section - enlarged */}
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

          {/* Form section - enlarged */}
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
                    defaultValue={dummyProfile.full_name}
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Ngày sinh
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg text-xl"
                    defaultValue={dummyProfile.dob}
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-4 border rounded-lg text-xl"
                    defaultValue={dummyProfile.email}
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full p-4 border rounded-lg text-xl"
                    defaultValue={dummyProfile.phone_number}
                  />
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
                    defaultValue={dummyProfile.address}
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Phường/Xã
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg text-xl"
                    defaultValue={dummyProfile.ward}
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg text-xl"
                    defaultValue={dummyProfile.district}
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-3">
                    Tỉnh/Thành phố
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg text-xl"
                    defaultValue={dummyProfile.city}
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

  const PasswordContent = () => (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-8">Thay đổi mật khẩu</h2>
      <div className="space-y-6 max-w-3xl">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg text-lg"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Mật khẩu mới
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg text-lg"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg text-lg"
          />
        </div>
        <button className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 text-lg">
          Cập nhật mật khẩu
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileContent />;
      case "wallet":
        return <WalletContent />;
      case "password":
        return <PasswordContent />;
      default:
        return <WalletContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r">
        {/* <div className="p-6 border-b">
          <h1 className="text-2xl font-semibold">Nhantam Hodac</h1>
        </div> */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition text-xl ${
                activeTab === item.id
                  ? "bg-yellow-50 text-[#FEB60D]"
                  : "hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export default SettingsPage;
