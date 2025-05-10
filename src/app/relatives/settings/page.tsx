"use client";
import React, { useEffect, useState } from "react";
import {
  CreditCard,
  User,
  Lock,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import dummyTransactions from "@/dummy_data/dummy_transaction.json";
import DepositDialog from "@/app/components/Relatives/DepositDialog";
import ProfileContent from "@/app/components/Relatives/ProfileContent";
import { Invoice, PatientRecord } from "@/types/patient";
import patientApiRequest from "@/apiRequest/patient/apiPatient";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "đ");
  };

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return new Intl.DateTimeFormat("vi-VN", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }).format(date);
  // };

  const menuItems = [
    {
      id: "profile",
      label: "Thông tin người dùng",
      icon: <User className="w-6 h-6" />,
    },
    {
      id: "wallet",
      label: "Lịch sử thanh toán",
      icon: <CreditCard className="w-6 h-6" />,
    },
    // {
    //   id: "password",
    //   label: "Thay đổi mật khẩu",
    //   icon: <Lock className="w-6 h-6" />,
    // },
  ];

  const WalletContent = () => {
    const [profiles, setProfiles] = useState<PatientRecord[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
    const [isFetchingError, setIsFetchingError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPatientRecords = async () => {
      setIsLoading(true);
      setIsFetchingError(false);
      setError(null);

      try {
        const response = await patientApiRequest.getPatientRecord();
        setProfiles(response.payload.data);

        // Sau khi lấy được danh sách hồ sơ bệnh nhân, lấy lịch sử thanh toán
        if (response.payload.data.length > 0) {
          await fetchPaymentHistory(response.payload.data);
        }
      } catch (err) {
        setError("Không thể tải hồ sơ bệnh nhân");
        setIsFetchingError(true);
        console.error("Error fetching patient records: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPaymentHistory = async (patientRecords: PatientRecord[]) => {
      setIsLoadingInvoices(true);

      try {
        // Lấy danh sách patient-ids từ profiles
        const patientIds = patientRecords.map((profile) => profile.id);

        // Gọi API lấy lịch sử thanh toán
        const response = await patientApiRequest.getPaymentHistory({
          "patient-ids": patientIds,
        });

        if (response.payload.data) {
          setInvoices(response.payload.data);
        } else {
          setError("Không thể tải lịch sử thanh toán");
        }
      } catch (err) {
        setError("Không thể tải lịch sử thanh toán");
        console.error("Error fetching payment history: ", err);
      } finally {
        setIsLoadingInvoices(false);
      }
    };

    useEffect(() => {
      fetchPatientRecords();
    }, []);

    const handleDeposit = (amount: number) => {
      // Xử lý logic nạp tiền ở đây
      console.log(`Nạp tiền: ${amount}đ`);
    };

    return (
      <div className="p-8">
        <h2 className="text-4xl font-semibold mb-8">Lịch sử thanh toán</h2>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          {isLoading || isLoadingInvoices ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchPatientRecords}
                className="mt-4 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <ArrowDownCircle className="w-10 h-10 text-red-500" />
                      <div>
                        <div className="font-medium text-xl">
                          Thanh toán dịch vụ
                        </div>
                        {/* <div className="text-lg text-gray-500">
              {formatDate(invoice["created-at"])}
            </div> */}
                        <div
                          className={`text-md ${
                            invoice.status === "paid"
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          Trạng thái: {invoice.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-red-500">
                      {formatCurrency(invoice["total-fee"])}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Không có giao dịch nào
                </div>
              )}
            </div>
          )}
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
