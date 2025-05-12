"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter, // Import CardFooter for pagination controls
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
// Assuming appointmentApiRequest is not needed for this specific component based on usage
// import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { Invoice, InvoiceBody } from "@/types/invoice";
import invoiceApiRequest from "@/apiRequest/invoice/apiInvoice";

interface InvoiceTableProps {}

const ITEMS_PER_PAGE = 7; 

export default function InvoiceTable({}: InvoiceTableProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State for current page

  // Fetch invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true); // Set loading true at the start of fetch
      setError(null); // Reset error state
      try {
        const requestBody: InvoiceBody = {
          "is-admin": true,
          "patient-ids": [],
        };
        const response = await invoiceApiRequest.getInvoice(requestBody);

        if (response.status === 200 && Array.isArray(response.payload?.data)) {
          setInvoices(response.payload.data as Invoice[]);
          setCurrentPage(1); // Reset to first page when new data is fetched
        } else {
          throw new Error(
            response.payload?.message || "Failed to fetch invoices"
          );
        }
      } catch (err: any) {
        console.error("Error fetching invoices:", err);
        const errorMessage =
          err.message || "Không thể tải danh sách hóa đơn. Vui lòng thử lại.";
        setError(errorMessage);
        toast({
          title: "Lỗi",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    // Handle potential non-numeric values gracefully
    if (typeof amount !== "number" || isNaN(amount)) {
      return "N/A";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Filter invoices based on search term
  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return invoices.filter(
      (invoice) =>
        // invoice.id.toLowerCase().includes(lowerSearchTerm) || // ID column removed
        invoice["cuspackage-id"]?.toLowerCase().includes(lowerSearchTerm) || // Check if cuspackage-id exists
        invoice.status?.toLowerCase().includes(lowerSearchTerm) // Allow searching by status
    );
  }, [invoices, searchTerm]);

  // Reset page number when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedInvoices = useMemo(() => {
    return filteredInvoices.slice(startIndex, endIndex);
  }, [filteredInvoices, startIndex, endIndex]);

  // Status badge rendering
  const renderStatusBadge = (status: string | undefined | null) => {
    const lowerStatus = status?.toLowerCase() ?? "unknown";

    switch (lowerStatus) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Đã thanh toán
          </span>
        );
      case "unpaid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Chưa thanh toán
          </span>
        );
      // Note: The 'overdue' case was duplicated under 'unpaid'. Assuming it should be separate.
      case "overdue":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Quá hạn
          </span>
        );
      case "cancelled": // Example of another possible status
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status || "Không rõ"} {/* Display original status or 'Unknown' */}
          </span>
        );
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Card className="mb-6 bg-gradient-to-r from-emerald-400/10 to-transparent border-l-4 border-emerald-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-500">
            Quản lý hóa đơn
          </CardTitle>
          <CardDescription>
            Danh sách hóa đơn của bệnh nhân.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4"></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
              <p className="font-semibold">Lỗi tải dữ liệu</p>
              <p className="text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Thử lại
              </Button>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2"> Không tìm thấy hóa đơn</p>
              <p>
                {searchTerm
                  ? "Không có kết quả nào khớp với tìm kiếm của bạn."
                  : "Hiện tại chưa có hóa đơn nào."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">No.</TableHead>
                    <TableHead className="text-left">ID</TableHead>
                    <TableHead className="text-right">Tổng tiền</TableHead>
                    <TableHead className="text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((invoice, index) => {
                    const itemNumber = startIndex + index + 1; // Calculate correct item number across pages
                    return (
                      <TableRow
                        key={invoice.id || index}
                        className="hover:bg-muted/50 h-12"
                      >
                        {" "}
                        {/* Increased row height */}
                        <TableCell className="font-medium">
                          {itemNumber}
                        </TableCell>
                        <TableCell className="text-left">
                          {invoice.id || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(invoice["total-fee"])}
                        </TableCell>
                        <TableCell className="text-right">
                          {renderStatusBadge(invoice.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {!isLoading &&
          !error &&
          filteredInvoices.length > 0 &&
          totalPages > 1 && (
            <CardFooter className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Hiển thị {startIndex + 1}-
                {Math.min(endIndex, filteredInvoices.length)} trên{" "}
                {filteredInvoices.length} hóa đơn
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <span className="text-sm font-medium">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </CardFooter>
          )}
      </Card>
    </>
  );
}
