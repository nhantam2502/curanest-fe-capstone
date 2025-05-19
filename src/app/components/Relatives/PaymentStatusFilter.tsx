"use client";
import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentStatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const PaymentStatusFilter: React.FC<PaymentStatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  const statusOptions = [
    { id: "all", label: "Tất cả" },
    {
      id: "paid",
      label: "Đã thanh toán",
      icon: <Check className="w-8 h-8 text-green-500" />,
    },
    {
      id: "unpaid",
      label: "Chưa thanh toán",
      icon: <X className="w-8 h-8 text-red-500" />,
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-2xl font-medium text-gray-700 mb-3">
        Trạng thái thanh toán
      </h3>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Button
            key={option.id}
            variant={selectedStatus === option.id ? "default" : "outline"}
            size="default"
            className={`rounded-full text-xl font-medium transition-all ${
              selectedStatus === option.id
                ? "bg-primary text-white"
                : "text-gray-600"
            }`}
            onClick={() => onStatusChange(option.id)}
          >
            {option.icon && <span className="mr-1.5 ">{option.icon}</span>}
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PaymentStatusFilter;
