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
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { Invoice, InvoiceBody } from "@/types/invoice";
import invoiceApiRequest from "@/apiRequest/invoice/apiInvoice";

interface InvoiceTableProps {}

export default function InvoiceTable({}: InvoiceTableProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const requestBody: InvoiceBody = {
          "is-admin": true,
          "patient-ids": [] 
        };
        const response = await invoiceApiRequest.getInvoice(requestBody);
        
        if (response.status === 200 && Array.isArray(response.payload?.data)) {
          setInvoices(response.payload.data as Invoice[]);
        } else {
          throw new Error("Failed to fetch invoices");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Không thể tải danh sách hóa đơn");
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.",
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
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  // Filter invoices based on search term
  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return invoices.filter(invoice => 
      invoice.id.toLowerCase().includes(lowerSearchTerm) ||
      invoice["cuspackage-id"].toLowerCase().includes(lowerSearchTerm)
    );
  }, [invoices, searchTerm]);

  // Status badge rendering
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
            Đã thanh toán
          </span>
        );
      case "unpaid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
            Chưa thanh toán
          </span>
        );
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
            Quá hạn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Danh sách hóa đơn</CardTitle>
            <CardDescription>
              Quản lý các hóa đơn.
            </CardDescription>
          </div>
          <div className="relative">
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[400px]"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-destructive/10 p-4 text-destructive">
            <p>{error}</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Không có hóa đơn nào được tìm thấy</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã hóa đơn</TableHead>
                  <TableHead>Mã gói dịch vụ</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice["cuspackage-id"]}</TableCell>
                    <TableCell>
                      {formatCurrency(invoice["total-fee"])}
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(invoice.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}