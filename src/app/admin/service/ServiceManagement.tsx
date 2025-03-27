"use client";
import React, { useEffect, useState, useCallback } from "react";
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
import { useToast } from "@/hooks/use-toast"; // Assuming correct path
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
import serviceApiRequest from "@/apiRequest/service/apiServices"; // Assuming API functions exist
import { ServiceCate, ServiceFilter } from "@/types/service"; // Assuming correct types
import { Search, Edit, Trash2 } from "lucide-react"; // Added Icons
import ServiceForm from "./ServiceForm"; // Assuming ServiceForm exists

interface ServiceManagementProps {
  selectedCategoryId: string | null; // Allow null if no category is initially selected
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({
  selectedCategoryId,
}) => {
  const { toast } = useToast(); // 1. Get toast function
  const [services, setServices] = useState<ServiceCate[]>([]);
  const [searchQuery, setSearchQuery] = useState<ServiceFilter | null>(null);

  // State for deletion
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(null); // 2. State for delete target
  const [isDeleting, setIsDeleting] = useState(false); // 2. State for delete loading

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [openCreateServiceModal, setOpenCreateServiceModal] = useState(false);

  // --- Fetch Services ---
  const fetchServices = useCallback(async () => {
    // Don't fetch if no category is selected
    if (!selectedCategoryId) {
        setServices([]);
        setCurrentPage(1); // Reset page if category becomes null
        return;
    }
    try {
      // API call uses selectedCategoryId and searchQuery
      const response = await serviceApiRequest.getService(
        selectedCategoryId,
        searchQuery
      );
      if (response.status === 200 && response.payload) {
        const data = response.payload.data || [];
        setServices(data);
        setCurrentPage(1); // Reset to first page on new fetch/search
      } else {
        console.error("Error fetching services:", response);
        // 5. Toast on fetch error
        toast({
          variant: "destructive",
          title: "Lỗi tải dịch vụ",
          description: response.payload?.message || "Không thể tải danh sách dịch vụ.",
        });
        setServices([]); // Clear data on error
      }
    } catch (error: any) {
      console.error("Error fetching services:", error);
       // 5. Toast on fetch exception
      toast({
          variant: "destructive",
          title: "Lỗi tải dịch vụ",
          description: error.message || "Đã xảy ra lỗi khi tải dữ liệu.",
      });
      setServices([]); // Clear data on error
    }
  // Add toast to dependencies as it's used inside
  }, [searchQuery, selectedCategoryId, toast]);

  // Effect to fetch when category or search query changes
  useEffect(() => {
    fetchServices();
  }, [fetchServices]); // fetchServices includes selectedCategoryId and searchQuery

  // --- Delete Service ---
  const handleDeleteService = async () => {
    // if (!serviceToDeleteId) return;

    // setIsDeleting(true); // 2. Set loading state
    // try {
    //   // Assuming you have a deleteService function
    //   const response = await serviceApiRequest.deleteService(serviceToDeleteId);

    //   if (response.status === 200) { // Check for success status
    //     // 5. Toast on delete success
    //     toast({
    //       title: "Thành công",
    //       description: "Đã xoá dịch vụ thành công.",
    //     });
    //     setServiceToDeleteId(null); // Clear the ID
    //     fetchServices(); // 4. Refresh the list after successful deletion
    //   } else {
    //     console.error("Error deleting service:", response);
    //      // 5. Toast on delete API error
    //     toast({
    //       variant: "destructive",
    //       title: "Lỗi xoá dịch vụ",
    //       description: response.payload?.message || "Không thể xoá dịch vụ này.",
    //     });
    //   }
    // } catch (error: any) {
    //   console.error("Error deleting service:", error);
    //    // 5. Toast on delete exception
    //   toast({
    //     variant: "destructive",
    //     title: "Lỗi xoá dịch vụ",
    //     description: error.message || "Đã xảy ra lỗi khi xoá dịch vụ.",
    //   });
    // } finally {
    //   setIsDeleting(false); // 2. Reset loading state
    //   // Ensure dialog content unmounts correctly or manually clear ID
    //   // setServiceToDeleteId(null); // Moved to success block
    // }
  };

  // --- Refresh on Create ---
  const handleServiceCreated = () => {
    setOpenCreateServiceModal(false); // Close the modal
    fetchServices(); // 4. Refresh the list
     // Optionally show a success toast here if ServiceForm doesn't
     toast({
        title: "Thành công",
        description: "Đã tạo dịch vụ mới thành công."
     })
  };

  // --- Pagination Calculations (Simplified: operate directly on 'services') ---
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const paginatedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Search Handler ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update searchQuery state, the useEffect will trigger fetchServices
    setSearchQuery({ "service-name": e.target.value });
  };

  // --- Prepare Delete ---
  const prepareDelete = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent potential row click triggers
    setServiceToDeleteId(serviceId);
  };

  // --- Render ---
  return (
    <div className="w-full p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <Label className="text-xl font-semibold">Quản lý dịch vụ</Label>
        {/* Pass categoryId and success callback to ServiceForm */}
        <ServiceForm
          categoryId={selectedCategoryId} // Pass the selected category ID
          open={openCreateServiceModal}
          onOpenChange={setOpenCreateServiceModal}
          onSuccess={handleServiceCreated} // 4. Pass refresh handler
        />
      </div>

      {/* Search Input */}
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Tìm theo tên dịch vụ..."
          value={searchQuery?.["service-name"] || ""}
          onChange={handleSearchChange}
          className="pr-10"
          disabled={!selectedCategoryId} // Disable search if no category selected
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

       {/* Service Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">Tên dịch vụ</TableHead>
              <TableHead className="w-[45%]">Mô tả</TableHead>
              <TableHead className="w-[20%] text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!selectedCategoryId ? ( // Show message if no category selected
                <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        Vui lòng chọn một danh mục để xem dịch vụ.
                    </TableCell>
                </TableRow>
            ) : paginatedServices.length === 0 ? ( // Show message if category selected but no services
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Không có dịch vụ nào trong danh mục này.
                </TableCell>
              </TableRow>
            ) : (
              paginatedServices.map((service) => (
                <TableRow key={service.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground line-clamp-3">
                    {service.description}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {/* TODO: Implement Edit Functionality */}
                    {/* <Button variant="ghost" size="icon" onClick={(e) => {/* Handle Edit *\/}}>
                      <Edit className="h-4 w-4" />
                    </Button> */}
                    <AlertDialog onOpenChange={(isOpen) => {if (!isOpen) setServiceToDeleteId(null); }}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => prepareDelete(service.id, e)} // 3. Set ID to delete
                          disabled={isDeleting && serviceToDeleteId === service.id} // Disable specific button while deleting
                        >
                           {isDeleting && serviceToDeleteId === service.id ? (
                             <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-destructive rounded-full"></span> // Simple spinner
                           ) : (
                             <Trash2 className="h-4 w-4" />
                           )}
                        </Button>
                      </AlertDialogTrigger>
                      {/* Conditional rendering for content might be safer */}
                      {serviceToDeleteId === service.id && (
                           <AlertDialogContent>
                           <AlertDialogHeader>
                             <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
                             <AlertDialogDescription>
                               Bạn có chắc chắn muốn xoá dịch vụ "{service.name}"? Hành động này không thể hoàn tác.
                             </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                             <AlertDialogCancel onClick={() => setServiceToDeleteId(null)}>Hủy</AlertDialogCancel>
                             <AlertDialogAction
                               onClick={handleDeleteService} // 3. Call delete handler
                               disabled={isDeleting}
                               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                             >
                               {isDeleting ? "Đang xoá..." : "Xoá"}
                             </AlertDialogAction>
                           </AlertDialogFooter>
                         </AlertDialogContent>
                      )}
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {selectedCategoryId && totalPages > 1 && ( // Only show pagination if a category is selected and multiple pages exist
        <div className="flex justify-end items-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước {/* 7. Translate */}
          </Button>
          <span className="text-sm font-medium">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Sau {/* 7. Translate */}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;