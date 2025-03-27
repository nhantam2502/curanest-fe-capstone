import React, { useState } from "react";
import {
  Info,
  Check,
  Baby,
  Heart,
  Home,
  ActivitySquare,
  Utensils,
  ShieldAlert,
  Clipboard,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceItem, TransformedCategory } from "@/types/service";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categoryIcons: { [key: string]: React.ReactNode } = {
  "Chăm sóc cho bé yêu": <Baby className="w-7 h-7 text-pink-500" />,
  "Chăm sóc cơ bản": <Heart className="w-7 h-7 text-blue-500" />,
  "Y tế tại nhà": <Home className="w-7 h-7 text-green-500" />,
  "Phục hồi chức năng": <ActivitySquare className="w-7 h-7 text-purple-500" />,
  "Hỗ trợ dinh dưỡng và vệ sinh": (
    <Utensils className="w-7 h-7 text-amber-500" />
  ),
  "Chăm sóc đặc biệt": <ShieldAlert className="w-7 h-7 text-red-500" />,
  "Tư vấn sức khỏe": <Clipboard className="w-7 h-7 text-teal-500" />,
};

interface Step1Props {
  serviceCategories: TransformedCategory[];
  selection: { categoryId: string; serviceId: string; serviceName?: string } | null;
  setSelection: (
    selection: { categoryId: string; serviceId: string; serviceName?: string } | null
  ) => void;

  onNext: () => void;
  isLoading?: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ServiceCategorySelection: React.FC<Step1Props> = ({
  serviceCategories,
  selection,
  setSelection,
  onNext,
  isLoading = false,
  searchTerm,
  setSearchTerm,
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearch);
  };

  const handleReset = () => {
    setLocalSearch("");
    setSearchTerm("");
  };

  const filteredCategories = searchTerm
    ? (serviceCategories
        .map((category) => {
          const filteredServices = category.services.filter((service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return filteredServices.length > 0
            ? {
                ...category,
                services: filteredServices,
              }
            : null;
        })
        .filter(Boolean) as TransformedCategory[])
    : serviceCategories;

  return (
    <div className="space-y-6 text-lg">
      <h2 className="text-4xl font-bold">Chọn loại dịch vụ</h2>
      <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
        <Info className="mr-2" />
        Chọn loại dịch vụ phù hợp với nhu cầu của bạn
      </p>

      {/* Search component - improved */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-4 py-6 w-full text-base border-gray-200 focus:border-gray-100 focus:ring-gray-100"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => setLocalSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={!localSearch.trim()} // Vô hiệu hóa khi input rỗng
              className={cn(
                "py-6 text-lg font-medium flex items-center",
                !localSearch.trim()
                  ? "bg-[#e5ab47]/90 cursor-not-allowed"
                  : "bg-[#e5ab47] hover:bg-[#e5ab47]"
              )}
            >
              <Search className="mr-2 h-5 w-5" />
              Tìm kiếm
            </Button>

            {(searchTerm || localSearch) && (
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 py-6 text-lg font-medium flex items-center"
              >
                <X className="mr-2 h-5 w-5" />
                Xóa tìm kiếm
              </Button>
            )}
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-xl text-gray-500 font-medium">
            Không tìm thấy dịch vụ nào
          </p>
          <p className="text-gray-400 mt-2">
            Vui lòng thử lại với từ khóa khác
          </p>
          {searchTerm && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="mt-4 border-gray-300 hover:bg-gray-50"
            >
              Xóa tìm kiếm
            </Button>
          )}
        </div>
      ) : (
        <ScrollArea className="max-h-[500px] overflow-y-auto">
          <div className="space-y-8 mt-6">
            {filteredCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    {categoryIcons[category.name] || (
                      <Info className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold">{category.name}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.services.map((service, idx) => {
                    // Find the original index in the unfiltered category
                    const originalServiceIdx = (
                      serviceCategories
                        .find((c) => c.id === category.id)
                        ?.services.findIndex((s) => s.name === service.name) ??
                      0
                    ).toString();

                    return (
                      <button
                        key={idx}
                        className={cn(
                          "p-4 rounded-lg border text-xl text-left transition-all hover:shadow-md",
                          selection?.categoryId === category.id &&
                            selection?.serviceId === service.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                            : "border-gray-200 hover:border-primary/50"
                        )}
                        onClick={() => {
                          setSelection({
                            categoryId: category.id,
                            serviceId: service.id,
                            serviceName: service.name, // Thêm service.name vào selection
                          });
                        }}
                        
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">{service.name}</span>
                          {selection?.categoryId === category.id &&
                            selection?.serviceId === service.id && (
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      )}
    </div>
  );
};
