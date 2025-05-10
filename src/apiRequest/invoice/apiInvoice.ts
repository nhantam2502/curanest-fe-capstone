import http from "@/lib/http";
import { InvoiceBody, PatchRes } from "@/types/invoice";
import { Res } from "@/types/service";

const invoiceApiRequest = {
  getInvoice: (body: InvoiceBody) =>
    http.post<Res>(`/appointment/api/v1/invoices/patient`, body),

  createPaymentUrl: (invoiceID: string) =>
    http.patch<PatchRes>(
      `/appointment/api/v1/invoices/${invoiceID}/create-payment-url`
    ),

  cancelPaymentUrl: (orderCode: string) =>
    http.patch<PatchRes>(
      `/appointment/api/v1/invoices/cancel-payment-url/${orderCode}`
    ),
};

export default invoiceApiRequest;
