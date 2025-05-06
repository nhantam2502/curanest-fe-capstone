import http from "@/lib/http";
import { InvoiceBody } from "@/types/invoice";
import { Res } from "@/types/service";


const invoiceApiRequest = {
  getInvoice: (body:InvoiceBody) =>
    http.post<Res>(`/appointment/api/v1/invoices/patient`,body),

};

export default invoiceApiRequest;
