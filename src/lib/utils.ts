import { PackageServiceItem, ServiceTaskType } from "@/types/service";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500";
    case "waiting":
      return "bg-yellow-500";
    case "canceled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "Hoàn thành";
    case "pending":
      return "Đang chờ";
    case "canceled":
      return "Đã hủy";
    default:
      return status;
  }
};

// Hàm lấy ngày định dạng YYYY-MM-DD
export const getFormattedDate = (estDate: string) => {
  const date = new Date(estDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

// Hàm xử lý est-date để lấy giờ bắt đầu (cộng 7 giờ)
export const getStartTimeFromEstDate = (estDate: string) => {
  const date = new Date(estDate); // Parse chuỗi ISO 8601
  const utcHours = date.getUTCHours(); // Lấy giờ UTC
  const utcMinutes = date.getUTCMinutes(); // Lấy phút UTC
  const adjustedHours = (utcHours + 7) % 24; // Cộng 7 giờ, đảm bảo trong 0-23
  return `${String(adjustedHours).padStart(2, "0")}:${String(utcMinutes).padStart(2, "0")}`; // Định dạng HH:MM
};

export const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const calculateAdvancedPricing = (
  service: ServiceTaskType,
  quantity: number
) => {
  let baseCost = service.cost;
  let baseDuration = service["est-duration"];

  // Check if additional pricing logic should be applied
  if (
    service["additional-cost"] !== 0 ||
    service["additional-cost-desc"] !== "" ||
    service.unit !== "default" ||
    service["price-of-step"] !== 0
  ) {
    // Only add additional cost for quantities beyond the first
    if (quantity > 1) {
      baseCost += (service["additional-cost"] || 0) * (quantity - 1);

      // Only update baseDuration when quantity > 1
      if (service.unit === "time") {
        baseDuration += (service["price-of-step"] || 0) * (quantity - 1);
      } else if (service.unit === "quantity") {
        baseDuration += (service["price-of-step"] || 0) * quantity;
      }
    }
  }

  return {
    totalCost: baseCost,
    totalDuration: baseDuration,
  };
};

export const calculatePackagePrice = (
  services: PackageServiceItem[]
): number => {
  return services.reduce(
    (total: number, service: PackageServiceItem) =>
      total + (service.price ?? 0),
    0
  );
};

export const calculatePackageTotalTime = (
  services: PackageServiceItem[]
): number => {
  return services.reduce(
    (total: number, service: PackageServiceItem) =>
      total + service["time-interval"],
    0
  );
};
