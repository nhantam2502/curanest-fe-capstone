"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Services } from "@/types/service"; // Use Service (singular) for individual service type
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface ServiceListProps {
  services: Services[];
  onAddService: (newService: Services) => void;
  onDeleteService: (serviceId: number) => void;
}

function ServiceList({
  services,
  onAddService,
  onDeleteService,
}: ServiceListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const { toast } = useToast();

  const handleAddService = () => {
    if (!newServiceName.trim() || !newServiceDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both service name and description.",
      });
      return;
    }

    const newService: Services = {
      id: Date.now(), // Replace with your ID generation logic
      name: newServiceName,
      duration: "30 minutes",
      fee: 100,
      major_id: 1, // Replace with the actual major ID
    };

    onAddService(newService);
    setNewServiceName("");
    setNewServiceDescription("");
    setIsAddDialogOpen(false);
    toast({
      variant: "default",
      title: "Success",
      description: "You have created a service",
    });
  };

  const handleDeleteService = (serviceId: number) => {
    onDeleteService(serviceId);
    toast({
      variant: "default",
      title: "Success",
      description: "You have deleted a service",
    });
  };

  return (
    <div className="p-4 relative">
      <Table className="mb-4">
        <TableHeader>
          <TableRow>
            <TableHead>Tên dịch vụ</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Phí</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.duration}</TableCell>
              <TableCell>{service.fee}</TableCell>
              <TableCell className="text-right space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Bạn có chắc chắn muốn xóa dịch vụ này?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteService(service.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Thêm</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm dịch vụ</DialogTitle>
              <DialogDescription>
                Nhập thông tin của dịch vụ.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên
                </Label>
                <Input
                  id="name"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả
                </Label>
                <Input
                  id="description"
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Huỷ
              </Button>
              <Button type="submit" onClick={handleAddService}>
                Thêm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default ServiceList;