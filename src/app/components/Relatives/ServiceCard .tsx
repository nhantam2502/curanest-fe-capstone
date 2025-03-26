import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Services } from "@/types/service";
import { Check } from "lucide-react";

type ServiceCardProps = {
    packageName: string;
    services: Services[];
    selectedMajor: string;
    handleMajorChange: (packageName: string) => void;
    setSelectedServices: (services: Services[]) => void;
  };

const ServiceCard: React.FC<ServiceCardProps> = ({
  packageName,
  services,
  selectedMajor,
  handleMajorChange,
  setSelectedServices,
}) => {
  const calculatePackagePrice = (services: Services[]): number => {
    return services.reduce(
      (total: number, service: Services) => total + (service.price ?? 0),
      0
    );
  };
  
  const calculatePackageTotalTime = (services: Services[]): number => {
    return services.reduce(
      (total: number, service: Services) => total + parseInt(String(service.time) || "0", 10),
      0
    );
  }; 
  

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <Card
      key={packageName}
      className={cn(
        "overflow-hidden transition-all cursor-pointer",
        selectedMajor === packageName
          ? "border-primary ring-2 ring-primary/30"
          : "border-gray-200 hover:border-primary/50"
      )}
      onClick={() => {
        handleMajorChange(packageName);
        setSelectedServices(services);
      }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-semibold mb-3">{packageName}</h3>
            <div className="text-lg text-gray-600 mb-4">
              {calculatePackageTotalTime(services)} phút • {services.length}{" "}
              dịch vụ
            </div>
            <div className="space-y-2 mt-4">
              <h4 className="font-semibold text-lg">Dịch vụ bao gồm:</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {services.map((service) => (
                  <li key={service.name} className="text-gray-700">
                    {service.name}{" "}
                    <span className="text-gray-500">({service.time} phút)</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="font-bold text-2xl text-red-600">
              {formatCurrency(calculatePackagePrice(services))}
            </span>
            {selectedMajor === packageName && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
