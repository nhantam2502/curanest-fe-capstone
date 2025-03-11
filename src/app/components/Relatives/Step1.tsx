import React from "react";
import { Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  services: string[];
}

interface Step1Props {
  serviceCategories: ServiceCategory[];
  selectedCategory: string | null;
  selectedCateService: number | null;
  setSelectedCategory: (category: string) => void;
  setSelectedCateService: (service: number) => void;
  onNext: () => void;
}

export const ServiceCategorySelection: React.FC<Step1Props> = ({
  serviceCategories,
  selectedCategory,
  selectedCateService,
  setSelectedCategory,
  setSelectedCateService,
  onNext,
}) => {
  return (
    <div className="space-y-6 text-lg">
      <h2 className="text-4xl font-bold">Chọn loại dịch vụ</h2>
      <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
        <Info className="mr-2" />
        Chọn loại dịch vụ phù hợp với nhu cầu của bạn
      </p>

      <div className="space-y-8 mt-6">
        {serviceCategories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <category.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">{category.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.services.map((service, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "p-4 rounded-lg border text-xl text-left transition-all hover:shadow-md",
                    selectedCategory === category.id &&
                      selectedCateService === idx
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "border-gray-200 hover:border-primary/50"
                  )}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedCateService(idx);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{service}</span>
                    {selectedCategory === category.id &&
                      selectedCateService === idx && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

