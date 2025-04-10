"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // For conditional classes
import { ChevronLeft, ChevronRight, Search, User, Clock, MapPin, Stethoscope, CheckCircle, XCircle, Loader2, Link2, UserCheck } from "lucide-react"; // Add Link2, UserCheck

// --- Mock Data Types (Assume similar types as before) ---
interface AppointmentDetails {
    id: string | number;
    patientName: string;
    appointmentTime: Date;
    serviceNeeded: string;
    district: string;
    status: 'Needs Assignment'; // Only show these
    requiredSkills?: string[]; // Important for matching
}

interface AvailableNurse {
    id: string | number;
    name: string;
    avatar?: string;
    major: string;
    skills: string[];
    district: string;
    status: 'Active'; // Only show these
    // Optional: current schedule/load indicator
}

// --- Mock Fetch Functions (Replace with API calls) ---
const fetchUnassignedAppointments = async (params: {
    search?: string;
    service?: string;
    page?: number;
    limit?: number;
}): Promise<{ appointments: AppointmentDetails[], total: number }> => {
    console.log("Fetching unassigned appointments:", params);
    await new Promise(res => setTimeout(res, 400));
    // Mock Data
    const allAppointments: AppointmentDetails[] = [
        { id: 'A001', patientName: "Nguyễn Thị Hoa", appointmentTime: new Date(Date.now() + 3*60*60*1000), serviceNeeded: "Truyền dịch tại nhà", district: "Quận 1", status: 'Needs Assignment', requiredSkills: ["Truyền dịch"] },
        { id: 'A002', patientName: "Trần Văn Nam", appointmentTime: new Date(Date.now() + 5*60*60*1000), serviceNeeded: "Chăm sóc vết thương", district: "Quận 3", status: 'Needs Assignment', requiredSkills: ["Vết thương"] },
        { id: 'A003', patientName: "Lê Thị Bích", appointmentTime: new Date(Date.now() + 24*60*60*1000), serviceNeeded: "Thay băng", district: "Quận 1", status: 'Needs Assignment', requiredSkills: ["Vết thương", "Thay băng"] },
        { id: 'A004', patientName: "Phạm Văn Cường", appointmentTime: new Date(Date.now() + 26*60*60*1000), serviceNeeded: "Tiêm thuốc", district: "Quận Bình Thạnh", status: 'Needs Assignment', requiredSkills: ["Tiêm"] },
         { id: 'A005', patientName: "Võ Thị Sen", appointmentTime: new Date(Date.now() + 2*60*60*1000), serviceNeeded: "Truyền dịch tại nhà", district: "Quận 10", status: 'Needs Assignment', requiredSkills: ["Truyền dịch"] },
    ];
     // Basic mock filtering
    let filtered = allAppointments;
    if (params.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter(a => a.patientName.toLowerCase().includes(searchLower) || a.serviceNeeded.toLowerCase().includes(searchLower));
    }
    if (params.service) {
        filtered = filtered.filter(a => a.serviceNeeded.toLowerCase().includes(params.service!.toLowerCase()));
    }
    const total = filtered.length;
    const page = params.page || 1;
    const limit = params.limit || 5;
    const startIndex = (page - 1) * limit;
    return { appointments: filtered.slice(startIndex, startIndex + limit), total };
};

const fetchAvailableNursesList = async (params: {
    search?: string;
    skill?: string;
    page?: number;
    limit?: number;
     // Optional: Params to find nurses suitable for a specific appointment
     forAppointmentId?: string | number;
     forAppointmentSkills?: string[];
     forAppointmentDistrict?: string;
}): Promise<{ nurses: AvailableNurse[], total: number, suitableNurseIds?: (string | number)[] }> => {
     console.log("Fetching available nurses list:", params);
     await new Promise(res => setTimeout(res, 500));
    // Mock Data
     const allNurses: AvailableNurse[] = [
        { id: 101, name: "Trần Thị Điều Dưỡng", major: "ĐD Tổng quát", skills: ["Tiêm", "Truyền dịch", "Vết thương"], district: "Quận 1", status: 'Active' },
        { id: 102, name: "Lê Văn Chăm Sóc", major: "Chăm sóc người già", skills: ["Vệ sinh", "Vận động"], district: "Quận 3", status: 'Active' },
        { id: 103, name: "Phạm Thị Y Tá", major: "ĐD Nhi", skills: ["Theo dõi trẻ", "Tiêm"], district: "Quận Bình Thạnh", status: 'Active' },
        { id: 104, name: "Hoàng Văn Hỗ Trợ", major: "ĐD Tổng quát", skills: ["Vết thương", "Sinh hiệu"], district: "Quận 3", status: 'Active' },
        { id: 105, name: "Đặng Thị An Toàn", major: "ĐD Tổng quát", skills: ["Tiêm", "Truyền dịch"], district: "Quận 10", status: 'Active' },
        { id: 106, name: "Ngô Văn Kiên", major: "ĐD Tổng quát", skills: ["Tiêm", "Truyền dịch", "Vết thương", "Thay băng"], district: "Quận 1", status: 'Active' },
     ];
     // Basic mock filtering
    let filtered = allNurses;
     if (params.search) {
          const searchLower = params.search.toLowerCase();
          filtered = filtered.filter(n => n.name.toLowerCase().includes(searchLower) || n.major.toLowerCase().includes(searchLower) || n.skills.some(s => s.toLowerCase().includes(searchLower)));
     }
     if (params.skill) {
          filtered = filtered.filter(n => n.skills.some(s => s.toLowerCase().includes(params.skill!.toLowerCase())));
     }

     // Mock suitability calculation (Backend should do this efficiently)
     let suitableNurseIds: (string | number)[] = [];
     if (params.forAppointmentSkills && params.forAppointmentSkills.length > 0) {
          suitableNurseIds = filtered
               .filter(nurse =>
                    params.forAppointmentSkills!.every(reqSkill =>
                         nurse.skills.some(nurseSkill => nurseSkill.toLowerCase() === reqSkill.toLowerCase())
                    )
                    // Optional: Add location preference (e.g., same district)
                    // && nurse.district === params.forAppointmentDistrict
               )
               .map(nurse => nurse.id);
     }


     const total = filtered.length;
     const page = params.page || 1;
     const limit = params.limit || 5;
     const startIndex = (page - 1) * limit;
     return { nurses: filtered.slice(startIndex, startIndex + limit), total, suitableNurseIds };
};

const assignNurseApi = async (appointmentId: string | number, nurseId: string | number): Promise<boolean> => {
    console.log(`API: Assign Nurse ${nurseId} to Appointment ${appointmentId}`);
    await new Promise(res => setTimeout(res, 600));
    return Math.random() > 0.1; // Simulate success
}

// --- Constants ---
const ITEMS_PER_PAGE = 5;

// --- Component ---
export default function AssignNurseDashboard() {
    // Appointments State
    const [appointments, setAppointments] = useState<AppointmentDetails[]>([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
    const [appointmentFilters, setAppointmentFilters] = useState({ search: "", service: "" });
    const [appointmentPage, setAppointmentPage] = useState(1);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | number | null>(null);

    // Nurses State
    const [nurses, setNurses] = useState<AvailableNurse[]>([]);
    const [isLoadingNurses, setIsLoadingNurses] = useState(false); // Initially false, load when appointment selected or filtered
    const [nurseFilters, setNurseFilters] = useState({ search: "", skill: "" });
    const [nursePage, setNursePage] = useState(1);
    const [totalNurses, setTotalNurses] = useState(0);
    const [selectedNurseId, setSelectedNurseId] = useState<string | number | null>(null);
    const [suitableNurseIds, setSuitableNurseIds] = useState<(string|number)[]>([]); // Store IDs of suitable nurses for selected appointment

    // Assignment State
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignmentResult, setAssignmentResult] = useState<'success' | 'error' | null>(null);
    const [nurseForConfirmation, setNurseForConfirmation] = useState<AvailableNurse | null>(null);

    const appointmentTotalPages = Math.ceil(totalAppointments / ITEMS_PER_PAGE);
    const nurseTotalPages = Math.ceil(totalNurses / ITEMS_PER_PAGE);

    // Fetch Appointments
    useEffect(() => {
        setIsLoadingAppointments(true);
        const params = { ...appointmentFilters, page: appointmentPage, limit: ITEMS_PER_PAGE };
        fetchUnassignedAppointments(params)
            .then(data => {
                setAppointments(data.appointments);
                setTotalAppointments(data.total);
            })
            .catch(err => console.error("Failed to load appointments:", err)) // Add error UI
            .finally(() => setIsLoadingAppointments(false));
    }, [appointmentFilters, appointmentPage]);

    // Fetch Nurses (conditionally)
    useEffect(() => {
         // Fetch nurses only if an appointment is selected OR if nurse filters are active
         const shouldFetchNurses = selectedAppointmentId != null || nurseFilters.search || nurseFilters.skill;
         if (!shouldFetchNurses) {
              setNurses([]); // Clear nurses if no appointment selected and no filters
              setTotalNurses(0);
              setSuitableNurseIds([]);
              return;
         }

        setIsLoadingNurses(true);
         const selectedApp = appointments.find(a => a.id === selectedAppointmentId);
        const params = {
            ...nurseFilters,
            page: nursePage,
            limit: ITEMS_PER_PAGE,
             // Add context from selected appointment if available
             forAppointmentId: selectedApp?.id,
             forAppointmentSkills: selectedApp?.requiredSkills,
             forAppointmentDistrict: selectedApp?.district,
        };
        fetchAvailableNursesList(params)
            .then(data => {
                setNurses(data.nurses);
                setTotalNurses(data.total);
                 setSuitableNurseIds(data.suitableNurseIds || []); // Store suitable IDs
            })
            .catch(err => console.error("Failed to load nurses:", err)) // Add error UI
            .finally(() => setIsLoadingNurses(false));
    }, [nurseFilters, nursePage, selectedAppointmentId, appointments]); // Re-run if selection changes

    // --- Handlers ---
    const handleAppointmentFilterChange = (key: 'search' | 'service', value: string) => {
        setAppointmentFilters(prev => ({ ...prev, [key]: value }));
        setAppointmentPage(1); // Reset page on filter change
    };

     const handleNurseFilterChange = (key: 'search' | 'skill', value: string) => {
        setNurseFilters(prev => ({ ...prev, [key]: value }));
        setNursePage(1); // Reset page on filter change
        // Selecting a nurse filter might implicitly deselect an appointment
        // setSelectedAppointmentId(null); // Optional: Decide if filtering nurses clears appointment selection
    };

    const handleSelectAppointment = (id: string | number) => {
         setSelectedAppointmentId(prevId => (prevId === id ? null : id)); // Toggle selection
         setNursePage(1); // Reset nurse page when appointment changes
         setSelectedNurseId(null); // Clear nurse selection
    };

     const handleSelectNurse = (id: string | number) => {
          setSelectedNurseId(prevId => (prevId === id ? null : id)); // Toggle nurse selection
          setNurseForConfirmation(nurses.find(n => n.id === id) || null);
          // This selection doesn't trigger the dialog directly, the main "Assign" button does
     }

     const handleAssignmentConfirmation = () => {
          if (!selectedAppointmentId || !selectedNurseId) {
               alert("Vui lòng chọn một cuộc hẹn và một điều dưỡng.");
               return;
          }
          const nurseToAssign = nurses.find(n => n.id === selectedNurseId);
          if (nurseToAssign) {
              setNurseForConfirmation(nurseToAssign); // Set for dialog
               // The AlertDialogTrigger button will now open the dialog
          } else {
               console.error("Selected nurse not found in the current list.");
          }
     }


    const handleConfirmAssignmentApi = async () => {
        if (!selectedAppointmentId || !nurseForConfirmation) return;

        setIsAssigning(true);
        setAssignmentResult(null);
        const success = await assignNurseApi(selectedAppointmentId, nurseForConfirmation.id);
        setIsAssigning(false);

        if (success) {
            setAssignmentResult('success');
            // Remove assigned appointment and nurse from lists locally (or refetch)
             setTimeout(() => {
                setAppointments(prev => prev.filter(a => a.id !== selectedAppointmentId));
                // Optionally update nurse status or refetch nurse list
                setNurses(prev => prev.filter(n => n.id !== nurseForConfirmation.id));
                setSelectedAppointmentId(null);
                setSelectedNurseId(null);
                setNurseForConfirmation(null);
                setAssignmentResult(null);
                // TODO: Add success toast
            }, 1500);
        } else {
            setAssignmentResult('error');
            // Keep dialog open
        }
    };

     const handleCancelAssignment = () => {
          setNurseForConfirmation(null); // Close dialog
          setIsAssigning(false);
          setAssignmentResult(null);
     };

    // --- Pagination ---
    const goToAppointmentPage = (page: number) => setAppointmentPage(Math.max(1, Math.min(page, appointmentTotalPages)));
    const goToNursePage = (page: number) => setNursePage(Math.max(1, Math.min(page, nurseTotalPages)));

     // --- Helpers ---
     const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
     const selectedAppointment = useMemo(() => appointments.find(a => a.id === selectedAppointmentId), [appointments, selectedAppointmentId]);


    return (
        <div className=" mx-auto p-4 space-y-6">
             <h1 className="text-2xl font-bold">Giao việc cho Điều dưỡng</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <Card className="h-full flex flex-col"> {/* Ensure card takes height */}
                    <CardHeader>
                        <CardTitle>Cuộc hẹn chờ giao</CardTitle>
                        <CardDescription>Danh sách các cuộc hẹn chưa có điều dưỡng.</CardDescription>
                        {/* Appointment Filters */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                           <Input placeholder="Tìm bệnh nhân, dịch vụ..." value={appointmentFilters.search} onChange={e => handleAppointmentFilterChange('search', e.target.value)} />
                            {/* Add more filters like date range or service type select if needed */}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto"> {/* Allow scrolling */}
                        {isLoadingAppointments ? (
                             <div className="flex justify-center items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                        ) : appointments.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Bệnh nhân</TableHead>
                                        <TableHead>Dịch vụ</TableHead>
                                        <TableHead>Thời gian</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.map((app) => (
                                        <TableRow
                                            key={app.id}
                                            onClick={() => handleSelectAppointment(app.id)}
                                            className={cn(
                                                "cursor-pointer hover:bg-muted/50",
                                                selectedAppointmentId === app.id && "bg-primary/10" // Highlight selected
                                            )}
                                        >
                                            <TableCell className="font-medium">{app.patientName} <span className="text-xs block text-muted-foreground">{app.district}</span></TableCell>
                                            <TableCell>{app.serviceNeeded}</TableCell>
                                            <TableCell className="text-xs">{new Date(app.appointmentTime).toLocaleString('vi-VN', { day: '2-digit', month:'2-digit', hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         ) : (
                              <div className="text-center py-10 text-muted-foreground">Không có cuộc hẹn nào chờ giao.</div>
                         )}
                    </CardContent>
                    {appointmentTotalPages > 1 && (
                        <CardFooter className="pt-4 border-t">
                            <div className="flex items-center justify-end space-x-2 w-full">
                                  <span className="text-xs text-muted-foreground">Trang {appointmentPage}/{appointmentTotalPages}</span>
                                  <Button variant="outline" size="sm" onClick={() => goToAppointmentPage(appointmentPage - 1)} disabled={appointmentPage <= 1}>Trước</Button>
                                  <Button variant="outline" size="sm" onClick={() => goToAppointmentPage(appointmentPage + 1)} disabled={appointmentPage >= appointmentTotalPages}>Sau</Button>
                            </div>
                        </CardFooter>
                    )}
                </Card>

                {/* --- Right Column: Available Nurses --- */}
                <Card className="h-full flex flex-col"> {/* Ensure card takes height */}
                    <CardHeader>
                        <CardTitle>
                             {selectedAppointment ? `Điều dưỡng phù hợp cho ${selectedAppointment.patientName}` : "Danh sách điều dưỡng"}
                        </CardTitle>
                        <CardDescription>
                            {selectedAppointment ? `Các điều dưỡng sẵn sàng và có thể đáp ứng yêu cầu.` : `Danh sách điều dưỡng đang hoạt động.`}
                        </CardDescription>
                         {/* Nurse Filters */}
                         <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <Input placeholder="Tìm tên, kỹ năng..." value={nurseFilters.search} onChange={e => handleNurseFilterChange('search', e.target.value)} />
                            {/* Add skill select filter if needed */}
                         </div>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto"> {/* Allow scrolling */}
                        {isLoadingNurses ? (
                             <div className="flex justify-center items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                         ) : nurses.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] hidden sm:table-cell">Avt</TableHead>
                                        <TableHead>Tên điều dưỡng</TableHead>
                                        <TableHead>Kỹ năng</TableHead>
                                         {selectedAppointmentId && <TableHead className="w-[60px] text-center">Phù hợp?</TableHead> }
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {nurses.map((nurse) => {
                                         const isSuitable = selectedAppointmentId && suitableNurseIds.includes(nurse.id);
                                         const isSelected = selectedNurseId === nurse.id;
                                         return (
                                             <TableRow
                                                 key={nurse.id}
                                                 onClick={() => handleSelectNurse(nurse.id)}
                                                 className={cn(
                                                    "cursor-pointer hover:bg-muted/50",
                                                    isSelected && "bg-primary/10" // Highlight selected nurse
                                                )}
                                             >
                                                <TableCell className="hidden sm:table-cell">
                                                    <Avatar className="h-8 w-8"><AvatarImage src={nurse.avatar} /><AvatarFallback>{getInitials(nurse.name)}</AvatarFallback></Avatar>
                                                </TableCell>
                                                <TableCell className="font-medium">{nurse.name} <span className="text-xs block text-muted-foreground">{nurse.district}</span></TableCell>
                                                <TableCell>
                                                     <div className="flex flex-wrap gap-1">
                                                         {nurse.skills.slice(0, 2).map(skill => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
                                                         {nurse.skills.length > 2 && <Badge variant="secondary" className="text-xs">+{nurse.skills.length - 2}</Badge>}
                                                     </div>
                                                </TableCell>
                                                 {selectedAppointmentId && (
                                                      <TableCell className="text-center">
                                                          {isSuitable ? <UserCheck className="h-5 w-5 text-green-600 mx-auto" /> : <span className="text-muted-foreground">-</span>}
                                                      </TableCell>
                                                 )}
                                            </TableRow>
                                         );
                                    })}
                                </TableBody>
                            </Table>
                         ) : (
                             <div className="text-center py-10 text-muted-foreground">
                                {selectedAppointmentId ? 'Không tìm thấy điều dưỡng phù hợp.' : 'Không có điều dưỡng nào.'}
                            </div>
                         )}
                    </CardContent>
                     {nurseTotalPages > 1 && (
                        <CardFooter className="pt-4 border-t">
                            <div className="flex items-center justify-end space-x-2 w-full">
                                  <span className="text-xs text-muted-foreground">Trang {nursePage}/{nurseTotalPages}</span>
                                  <Button variant="outline" size="sm" onClick={() => goToNursePage(nursePage - 1)} disabled={nursePage <= 1}>Trước</Button>
                                  <Button variant="outline" size="sm" onClick={() => goToNursePage(nursePage + 1)} disabled={nursePage >= nurseTotalPages}>Sau</Button>
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </div>

            {/* --- Assignment Action Area --- */}
            <Card className="mt-6">
                 <CardHeader>
                      <CardTitle>Xác nhận giao việc</CardTitle>
                      <CardDescription>Chọn một cuộc hẹn từ danh sách bên trái và một điều dưỡng từ danh sách bên phải, sau đó nhấn "Giao việc".</CardDescription>
                 </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center gap-4 justify-center p-6 text-sm">
                    <div className="flex items-center gap-2 border p-2 rounded bg-muted/50 min-w-[200px] justify-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={!selectedAppointment ? "italic text-muted-foreground" : ""}>
                            {selectedAppointment ? `${selectedAppointment.patientName} (${new Date(selectedAppointment.appointmentTime).toLocaleTimeString('vi-VN', { hour:'2-digit', minute: '2-digit'})})` : "Chưa chọn cuộc hẹn"}
                        </span>
                    </div>
                    <Link2 className="h-5 w-5 text-muted-foreground transform sm:rotate-0 rotate-90" />
                    <div className="flex items-center gap-2 border p-2 rounded bg-muted/50 min-w-[200px] justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className={!selectedNurseId ? "italic text-muted-foreground" : ""}>
                            {nurseForConfirmation?.name || (selectedNurseId ? "..." : "Chưa chọn điều dưỡng")}
                        </span>
                    </div>
                </CardContent>
                 <CardFooter className="justify-center">
                      <AlertDialog>
                         <AlertDialogTrigger asChild>
                              <Button
                                   onClick={handleAssignmentConfirmation} // Check selection first
                                   disabled={!selectedAppointmentId || !selectedNurseId}
                              >
                                   Giao việc
                              </Button>
                         </AlertDialogTrigger>
                          {/* Dialog Content - only shown when nurseForConfirmation is set */}
                          {nurseForConfirmation && selectedAppointment && (
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Xác nhận giao việc?</AlertDialogTitle>
                                       {isAssigning ? (
                                            <div className="flex items-center justify-center py-4"><Loader2 className="h-6 w-6 animate-spin mr-2"/> Đang xử lý...</div>
                                       ) : assignmentResult === 'error' ? (
                                             <div className="flex items-center text-red-600 py-4"><XCircle className="h-5 w-5 mr-2"/> Lỗi! Không thể giao việc.</div>
                                        ) : assignmentResult === 'success' ? (
                                             <div className="flex items-center text-green-600 py-4"><CheckCircle className="h-5 w-5 mr-2"/> Giao việc thành công!</div>
                                        ) : (
                                            <AlertDialogDescription>
                                                Giao cuộc hẹn cho <strong>{selectedAppointment.patientName}</strong> (Dịch vụ: {selectedAppointment.serviceNeeded}) lúc {new Date(selectedAppointment.appointmentTime).toLocaleString('vi-VN', { timeStyle: 'short', dateStyle: 'short' })}
                                                <br/>cho điều dưỡng <strong>{nurseForConfirmation.name}</strong>?
                                            </AlertDialogDescription>
                                        )}
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                       {(isAssigning || assignmentResult) ? (
                                            <Button variant="outline" onClick={handleCancelAssignment} disabled={isAssigning}>Đóng</Button>
                                       ) : (
                                            <>
                                                <AlertDialogCancel onClick={handleCancelAssignment}>Hủy</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleConfirmAssignmentApi}>Xác nhận</AlertDialogAction>
                                            </>
                                       )}
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          )}
                      </AlertDialog>
                 </CardFooter>
            </Card>
        </div>
    );
}