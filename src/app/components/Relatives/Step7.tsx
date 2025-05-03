import React from "react";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, FileText, User } from "lucide-react";
import { NurseItemType } from "@/types/nurse";
import { ServiceTaskType } from "@/types/service";
import { PatientRecord } from "@/types/patient";
import { SelectedDateTime } from "@/app/components/Relatives/SubscriptionTimeSelection";

interface OrderConfirmationProps {
  nurseSelectionMethod?: "manual" | "auto";
  selectedServiceTask: ServiceTaskType[];
  serviceQuantities: { [key: string]: number };
  formatCurrency: (value: number) => string;
  selectedNurse: NurseItemType | null;
  selectedTime: {
    timeSlot: { display: string; value: string };
    date: Date | string;
  } | null;
  selectedTimes: SelectedDateTime[];
  selectedPackage: {
    id: string;
    name: string;
    "combo-days"?: number;
    discount: number;
    [key: string]: any;
  } | null;
  calculateTotalTime: () => number;
  calculateTotalPrice: () => number;
  serviceNotes?: { [key: string]: string };
  selectedProfile?: PatientRecord | null;
}

export const OrderConfirmationComponent: React.FC<OrderConfirmationProps> = ({
  selectedServiceTask,
  serviceQuantities,
  formatCurrency,
  selectedNurse,
  selectedTime,
  selectedTimes,
  selectedPackage,
  calculateTotalPrice,
  calculateTotalTime,
  serviceNotes = {},
  selectedProfile,
}) => {
  const isSubscription =
    selectedPackage &&
    selectedPackage["combo-days"] &&
    selectedPackage["combo-days"] > 1;

  // Hàm lấy danh sách tên điều dưỡng đã chọn
  const getSelectedNurseNames = () => {
    const nurseNames: string[] = [];

    // Trường hợp gói một buổi
    if (selectedNurse) {
      nurseNames.push(selectedNurse["nurse-name"]);
    }

    // Trường hợp gói nhiều buổi
    if (selectedTimes && selectedTimes.length > 0) {
      selectedTimes.forEach((timeItem) => {
        if (timeItem.nurse && timeItem.nurse["nurse-name"]) {
          nurseNames.push(timeItem.nurse["nurse-name"]);
        }
      });
    }

    // Loại bỏ trùng lặp và trả về danh sách
    return Array.from(new Set(nurseNames));
  };

  return (
    <div className="space-y-6 text-lg">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
        {/* Hiển thị thông tin Patient Record */}
        {selectedProfile ? (
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-3">Hồ sơ bệnh nhân</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-xl">
              <div className="flex items-center space-x-2 text-gray-800">
                <span className="font-semibold">Tên:</span>
                <span>{selectedProfile["full-name"]}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-800">
                <span className="font-semibold">Ngày sinh:</span>
                <span>
                  {new Date(selectedProfile.dob).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-800">
                <span className="font-semibold">Giới tính:</span>
                <span>{selectedProfile.gender === true ? "Nam" : "Nữ"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 text-gray-500 italic text-center">
            Chưa chọn hồ sơ bệnh nhân
          </div>
        )}

        <Separator className="my-6" />

        <h3 className="text-2xl font-semibold mb-4">Dịch vụ đã chọn</h3>
        {/* Hiển thị tên gói nếu có */}
        {selectedPackage && (
          <div className="mb-4 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-primary">
                {selectedPackage.name}
              </h3>
              {selectedPackage.discount > 0 && (
                <div className="bg-red-100 text-red-700 px-2 py-2 rounded-full text-lg font-semibold min-w-[120px] text-center whitespace-nowrap">
                  Giảm {selectedPackage.discount}%
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hiển thị dịch vụ đã chọn */}
        <div className="space-y-2">
          {selectedServiceTask?.length > 0 ? (
            selectedServiceTask.map((service, index) => {
              const quantity = serviceQuantities[service.name] || 1;
              let additionalDuration = 0;
              let additionalCost = 0;

              if (quantity > 1 && service["price-of-step"]) {
                if (service.unit === "time") {
                  additionalDuration =
                    (quantity - 1) * service["price-of-step"];
                  additionalCost =
                    (quantity - 1) * (service["additional-cost"] || 0);
                } else if (service.unit === "quantity") {
                  additionalDuration =
                    (quantity - 1) *
                    (service["price-of-step"] * service["est-duration"]);
                  additionalCost =
                    (quantity - 1) * (service["additional-cost"] || 0);
                }
              }

              return (
                <div
                  key={index}
                  className="flex justify-between items-start p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-semibold text-xl">
                      {service.name}
                    </span>
                    {quantity > 1 && (
                      <span className="text-gray-600 ml-2 bg-gray-100 px-2 py-1 rounded-full text-sm">
                        x{quantity}
                      </span>
                    )}
                    <div className="text-lg text-gray-600 mt-1">
                      <Clock
                        className="inline-block mr-2 text-gray-500"
                        size={16}
                      />
                      <span>
                        {service["est-duration"]} phút
                        {quantity > 1 && additionalDuration > 0 && (
                          <span className="text-yellow-500 font-semibold ml-1">
                            (+{additionalDuration.toFixed(0)} phút)
                          </span>
                        )}
                      </span>
                    </div>
                    {/* Hiển thị ghi chú nếu có */}
                    {serviceNotes[service.name] && (
                      <div className="text-lg text-gray-600 mt-1">
                        <FileText
                          className="inline-block mr-2 text-gray-500"
                          size={16}
                        />
                        <span className="italic">
                          Ghi chú: {serviceNotes[service.name]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-xl text-primary">
                      {formatCurrency(service.cost + additionalCost)}
                    </span>
                    {quantity > 1 && additionalCost > 0 && (
                      <div className="text-sm text-green-600">
                        (Cơ bản: {formatCurrency(service.cost)})
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center text-lg">
              Chưa có dịch vụ nào được chọn.
            </p>
          )}
        </div>

        {/* <Separator className="my-6" /> */}

        {/* Hiển thị danh sách điều dưỡng đã chọn */}
        {/* <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">Danh sách điều dưỡng đã chọn</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-xl">
            {getSelectedNurseNames().length > 0 ? (
              getSelectedNurseNames().map((nurseName, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-800">
                  <User className="text-gray-500" size={20} />
                  <span>{nurseName}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-500 italic">Chưa chọn điều dưỡng</span>
            )}
          </div>
        </div> */}

        <Separator className="my-6" />

        {/* Hiển thị thời gian đã chọn - cho gói một lần */}
        {!isSubscription && selectedTime && (
          <div className="mt-4 mb-6">
            <h3 className="text-2xl font-semibold mb-3">Thời gian đã chọn</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg text-gray-800 space-y-2">
                <div className="flex items-center space-x-2 text-xl">
                  <Calendar className="text-primary" size={22} />
                  <span>
                    {typeof selectedTime.date === "string"
                      ? selectedTime.date
                      : new Date(selectedTime.date).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xl">
                  <Clock className="text-primary" size={22} />
                  <span>
                    {selectedTime.timeSlot.display}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-2 text-gray-800 text-xl">
                  <User className="text-primary" size={22} />
                  <span>
                    {selectedNurse
                      ? selectedNurse["nurse-name"]
                      : "Chưa chọn điều dưỡng"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hiển thị danh sách thời gian và điều dưỡng đã chọn - cho gói subscription */}
        {isSubscription && selectedTimes && selectedTimes.length > 0 && (
          <div className="mt-4 mb-6">
            <h3 className="text-2xl font-semibold mb-3">
              Lịch đã đặt ({selectedTimes.length}/
              {selectedPackage["combo-days"]} ngày)
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTimes.map((timeItem, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 p-3 rounded-md bg-white"
                  >
                    <div className="flex items-center space-x-2 text-gray-800">
                      <Calendar className="text-primary" size={18} />
                      <span>
                        {new Date(timeItem.date).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 text-gray-800">
                      <Clock className="text-primary" size={18} />
                      <span>{timeItem.timeSlot.display}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 text-gray-800">
                      <User className="text-primary" size={18} />
                      <span>
                        {timeItem.nurse
                          ? timeItem.nurse["nurse-name"]
                          : selectedNurse
                            ? selectedNurse["nurse-name"]
                            : "Chưa chọn điều dưỡng"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Separator className="my-6" />

        {/* Hiển thị tổng tiền */}
        <div className="mt-6 border-t border-gray-200 pt-5 rounded-lg bg-gray-50 p-4 shadow-sm">
          <div className="space-y-2">
            {isSubscription && (
              <div className="flex justify-between items-center text-xl">
                <span className="text-gray-600">Thời hạn gói:</span>
                <span className="font-medium text-gray-800">
                  {selectedPackage["combo-days"]} ngày
                </span>
              </div>
            )}

            {/* Tổng thời gian trong ngày */}
            <div className="flex justify-between items-center">
              <span className="text-xl text-gray-700 font-medium">
                Tổng thời gian (1 buổi):
              </span>
              <span className="text-xl font-semibold text-blue-600">
                {calculateTotalTime()} phút
              </span>
            </div>

            {/* Tổng tiền trong ngày */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Tổng tiền (1 buổi):
              </h3>
              <div className="flex flex-col items-end">
                {selectedPackage &&
                selectedPackage.discount &&
                selectedPackage.discount > 0 ? (
                  <>
                    <span className="font-bold font-be-vietnam-pro text-2xl text-red-600">
                      {formatCurrency(
                        calculateTotalPrice() *
                          (1 - selectedPackage.discount / 100)
                      )}
                    </span>
                    <span className="text-gray-500 text-lg line-through">
                      {formatCurrency(calculateTotalPrice())}
                    </span>
                  </>
                ) : (
                  <span className="font-bold font-be-vietnam-pro text-2xl text-red-600">
                    {formatCurrency(calculateTotalPrice())}
                  </span>
                )}
              </div>
            </div>

            {(selectedPackage?.["combo-days"] ?? 0) > 1 && (
              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Tổng tiền combo ({selectedPackage?.["combo-days"]} buổi):
                </h3>
                <div className="flex flex-col items-end">
                  {selectedPackage &&
                  selectedPackage.discount &&
                  selectedPackage.discount > 0 ? (
                    <>
                      <span className="font-bold font-be-vietnam-pro text-2xl text-red-600">
                        {formatCurrency(
                          calculateTotalPrice() *
                            (selectedPackage["combo-days"] ?? 0) *
                            (1 - selectedPackage.discount / 100)
                        )}
                      </span>
                      <span className="text-gray-500 text-lg line-through">
                        {formatCurrency(
                          calculateTotalPrice() *
                            (selectedPackage["combo-days"] ?? 0)
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold font-be-vietnam-pro text-2xl text-red-600">
                      {formatCurrency(
                        calculateTotalPrice() *
                          (selectedPackage?.["combo-days"] ?? 0)
                      )}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
