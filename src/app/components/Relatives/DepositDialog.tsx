import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DepositDialogProps {
  onDeposit: (amount: number) => void;
}

const DepositDialog: React.FC<DepositDialogProps> = ({ onDeposit }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleDeposit = () => {
    const depositAmount = Number(amount);
    if (isNaN(depositAmount) || depositAmount < 1000) {
      setError("Số tiền nạp phải từ 1,000₫ trở lên");
      return;
    }

    onDeposit(depositAmount);
    setAmount("");
    setError("");
    setOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "đ");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition text-xl flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Nạp tiền vào ví
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="pb-5 border-b">
          <DialogTitle className="text-3xl font-semibold flex items-center gap-3">
            <Wallet className="w-9 h-9 text-blue-500" />
            Nạp tiền vào ví
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-8 pt-5">
          <div className="space-y-3">
            <label
              htmlFor="amount"
              className="text-lg font-medium text-gray-700"
            >
              Số tiền muốn nạp
            </label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="Nhập số tiền cần nạp"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                className="text-xl px-6 py-8 pr-36 transition-shadow focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-lg">
                VNĐ
              </div>
            </div>
            
            {amount && (
              <div className="text-lg text-gray-600 mt-2">
                Số tiền bằng chữ: {formatCurrency(Number(amount))}
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="animate-shake">
              <AlertCircle className="h-6 w-6" />
              <AlertTitle className="text-lg font-medium">Lỗi</AlertTitle>
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4 pt-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6 py-3 text-lg"
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeposit}
              className="px-8 py-3 text-lg bg-blue-500 hover:bg-blue-600"
            >
              Xác nhận nạp tiền
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositDialog;
