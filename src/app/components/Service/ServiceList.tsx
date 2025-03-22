import React, { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { CategoryInfo, ServiceItem } from "@/types/service";
import serviceApiRequest from "@/apiRequest/service/apiServices";

type ApiResponseItem = {
  "category-info": CategoryInfo;
  "list-services": ServiceItem[];
};

type DisplayCategoryItem = {
  id: string;
  name: string;
  desc: string;
  bgColor: string;
  textColor: string;
};

// Mảng màu mặc định để áp dụng cho các danh mục
const colorSchemes = [
  {
    bgColor: "rgba(254, 182, 13, .2)",
    textColor: "#FEB60D",
  },
  {
    bgColor: "rgba(151, 113, 255, .2)",
    textColor: "#9771FF",
  },
  {
    bgColor: "rgba(1, 181, 197, .2)",
    textColor: "#01B5C5",
  }
];

const ServiceList: React.FC = () => {
  const [categories, setCategories] = useState<DisplayCategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await serviceApiRequest.getListService(null);

        // Chuyển đổi dữ liệu từ API thành định dạng dùng cho ServiceCard
        if (response.payload && response.payload.data) {
          const categoryItems: DisplayCategoryItem[] = response.payload.data.map(
            (item: ApiResponseItem, index: number) => ({
              id: item["category-info"].id,
              name: item["category-info"].name,
              desc: item["category-info"].description || "Our health System offers unmatched, expert health care.",
              ...colorSchemes[index % colorSchemes.length]
            })
          );
          
          setCategories(categoryItems);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load service categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Đang tải dịch vụ...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (categories.length === 0) {
    return <div className="text-center py-10">No service categories available at the moment.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
      {categories.slice(0, 6).map((item, index) => (
        <ServiceCard item={item} index={index} key={item.id || index} />
      ))}
    </div>
  );
  
};

export default ServiceList;