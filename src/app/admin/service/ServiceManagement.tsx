"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import serviceApiRequest from "@/apiRequest/service/apiServices";
import { ServiceCate, ServiceFilter } from "@/types/service";
import { Search } from "lucide-react";

interface ServiceManagementProps {
  selectedCategoryId: string;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({
  selectedCategoryId,
}) => {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceCate[]>([]);
  const [openCreateServiceModal, setOpenCreateServiceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<ServiceFilter | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchServices = useCallback(async () => {
    try {
      const response = await serviceApiRequest.getService(
        selectedCategoryId,
        searchQuery
      );
      if (response.status === 200 && response.payload) {
        const data = response.payload.data || [];
        setServices(data);
        // Reset to first page on new fetch
        setCurrentPage(1);
        console.log(data);
      } else {
        console.error("Error fetching services:", response);
        toast({
          title: "Lỗi tải dịch vụ",
          description:
            response.payload?.message || "Không thể tải dịch vụ.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, [searchQuery, selectedCategoryId, toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Only apply search filtering when there is input in the search box.
  const filteredServices = React.useMemo(() => {
    if (!searchQuery || !searchQuery["service-name"]) {
      return services;
    }
    const lowerCaseQuery = searchQuery["service-name"].toLowerCase();
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(lowerCaseQuery) ||
        service.description.toLowerCase().includes(lowerCaseQuery)
    );
  }, [services, searchQuery]);

  // Compute pagination values
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateService = () => {
    fetchServices();
  };

  const handleCloseForm = () => {
    setOpenCreateServiceModal(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery({ "service-name": e.target.value });
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Label className="text-lg font-bold">Quản lý dịch vụ</Label>
        <ServiceForm
          open={openCreateServiceModal}
          onOpenChange={setOpenCreateServiceModal}
          onCreateService={handleCreateService}
          onCancel={handleCloseForm}
        />
      </div>
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc mô tả..."
          value={searchQuery?.["service-name"] || ""}
          onChange={handleSearchChange}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
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
          {paginatedServices.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center italic text-gray-500"
              >
                Không có dịch vụ nào.
              </TableCell>
            </TableRow>
          ) : (
            paginatedServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell className="text-right font-medium space-x-2">
                  <Button variant="ghost" size="sm">
                    Sửa
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Xoá
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xoá dịch vụ này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction>
                          {/* Add delete logic here */}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
