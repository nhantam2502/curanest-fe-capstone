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
import dummyTransactions from "@/dummy_data/dummy_transaction.json";
import DepositDialog from "@/app/components/Relatives/DepositDialog";
import ProfileContent from "@/app/components/Relatives/ProfileContent";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("wallet");

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

  const WalletContent = () => {
    const handleDeposit = (amount: number) => {
      // Xử lý logic nạp tiền ở đây
      console.log(`Nạp tiền: ${amount}₫`);
    };

    return (
      <div className="p-8">
        <h2 className="text-4xl font-semibold mb-8">Ví tiền</h2>
        <div className="bg-gradient-to-r from-blue-300 to-yellow-300 rounded-xl p-8 text-white mb-8">
          <div className="text-7xl font-bold mb-4">0đ</div>
          <div className="text-2xl mb-6">Số dư ví</div>
          <DepositDialog onDeposit={handleDeposit} />
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
