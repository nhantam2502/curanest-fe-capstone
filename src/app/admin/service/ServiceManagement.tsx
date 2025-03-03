"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ServiceForm from "./ServiceForm";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

interface ServiceManagementProps {
  selectedCategoryId: number | null;
}

interface ServiceCategory {
  id: number;
  name: string;
  description: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  category_id: number;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ selectedCategoryId }) => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [openCreateServiceModal, setOpenCreateServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      // ... (fetch services logic - no changes here) ...
      const dummyServices: Service[] = [
        { id: 301, category_id: 1, name: "Vệ sinh cá nhân", description: "Dịch vụ vệ sinh cá nhân tại nhà" },
        { id: 302, category_id: 1, name: "Thay băng", description: "Dịch vụ thay băng và chăm sóc vết thương" },
        { id: 303, category_id: 2, name: "Theo dõi tim mạch", description: "Dịch vụ theo dõi tim mạch chuyên sâu" },
        { id: 304, category_id: 2, name: "Hỗ trợ hô hấp", description: "Dịch vụ hỗ trợ hô hấp và oxy liệu pháp" },
        { id: 305, category_id: 3, name: "Lấy mẫu xét nghiệm", description: "Dịch vụ lấy mẫu xét nghiệm tại nhà" },
        { id: 306, category_id: 3, name: "Hướng dẫn dùng thuốc", description: "Dịch vụ hướng dẫn sử dụng thuốc và quản lý đơn thuốc" },
      ];
      setServices(dummyServices);
    };

    const fetchCategoriesForForm = async () => {
      // ... (fetch categories for form logic - no changes here) ...
      const dummyCategories: ServiceCategory[] = [
        { id: 201, name: "Chăm sóc cơ bản", description: "Dịch vụ chăm sóc cơ bản" },
        { id: 202, name: "Chăm sóc chuyên sâu", description: "Dịch vụ chăm sóc chuyên sâu" },
        { id: 203, name: "Hỗ trợ y tế", description: "Dịch vụ hỗ trợ y tế" },
      ];
      setCategories(dummyCategories);
    };

    fetchServices();
    fetchCategoriesForForm();
  }, []);

  const filteredServices = React.useMemo(() => {
    if (!selectedCategoryId) {
      return services;
    }
    return services.filter(service => service.category_id === selectedCategoryId);
  }, [services, selectedCategoryId]);

  const handleCreateService = () => {
    const nextId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 307;
    const newService: Service = {
      // ... (handle create service logic - no changes here) ...
      id: nextId,
      category_id: 0, //parseInt(createdService.categoryId, 10), not available yet but avoid type error
      name: "dummy service",
      description: "dummy des",
    };
    setServices([...services, newService]);
    setOpenCreateServiceModal(false);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setOpenCreateServiceModal(true);
  };

  const handleUpdateService = (updatedService: Service) => {
    // ... (handle update service logic - no changes here) ...
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
    setEditingService(null);
    setOpenCreateServiceModal(false);
  };

  const handleCloseForm = () => {
    setOpenCreateServiceModal(false);
    setEditingService(null);
  };

  const handleDeleteService = async (serviceId: number) => {
    setIsDeleting(true);
    setServiceToDeleteId(serviceId);

    // Simulate API call - replace with your actual API delete call
    setTimeout(() => {
      setServices(services.filter((service) => service.id !== serviceId));
      setIsDeleting(false);
      setServiceToDeleteId(null);
      toast({
        title: "Thành công",
        description: "Dịch vụ đã được xoá thành công.",
      });
    }, 1000);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Label className="text-lg font-bold">Quản lý dịch vụ</Label>
        <ServiceForm
          open={openCreateServiceModal}
          onOpenChange={setOpenCreateServiceModal}
          onCreateService={handleCreateService}
          categories={categories}
          editingService={editingService}
          onUpdateService={handleUpdateService}
          onCancel={handleCloseForm}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên dịch vụ</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          { selectedCategoryId === null ? ( // Conditional rendering here
            <TableRow>
              <TableCell colSpan={3} className="text-center italic text-gray-500">
                Chọn danh mục để xem dịch vụ
              </TableCell>
            </TableRow>
          ) : (
            filteredServices.map((service) => ( // Render services if category is selected or if there are services even without category selected
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell className="text-right font-medium space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                    Sửa
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                      >
                        Xoá
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xoá dịch vụ này? Hành động này
                          không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            serviceToDeleteId === service.id &&
                            handleDeleteService(service.id)
                          }
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Đang xoá..." : "Xoá"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceManagement;