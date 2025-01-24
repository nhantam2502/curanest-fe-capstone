// app/service-management/page.tsx
"use client";
import { Major } from "@/types/major";
import { Nurse, NurseService } from "@/types/nurse";
import { Services } from "@/types/service";
import { useState, useEffect } from "react";
import MajorList from "./MajorList";
import NurseList from "./NurseList";
import ServiceList from "./ServiceList";
import { Separator } from "@/components/ui/separator";

const dummyMajors: Major[] = [{ id: 1, name: "Major 1" }];

const dummyNurses: NurseService[] = [{ id: 1, name: "John Doe", major_id: 1 }];

const dummyServices: Services[] = [
  { id: 1, name: "Blood test", major_id: 1, duration: "30 minutes", fee: 100 },
];

function ServiceManagementPage() {
  const [majors, setMajors] = useState<Major[]>(dummyMajors);
  const [nurses, setNurses] = useState<NurseService[]>(dummyNurses);
  const [services, setServices] = useState<Services[]>(dummyServices);
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);

  // Filter nurses and services based on selected major
  const filteredNurses = selectedMajorId
    ? nurses.filter((nurse) => nurse.major_id === selectedMajorId)
    : [];
  const filteredServices = selectedMajorId
    ? services.filter((service) => service.major_id === selectedMajorId)
    : [];

  // Fetch data from API (replace dummy data in a real app)
  useEffect(() => {
    // Example API call (replace with your actual API endpoints)
    // const fetchData = async () => {
    //   const majorsRes = await fetch("/api/majors");
    //   const majorsData = await majorsRes.json();
    //   setMajors(majorsData);
    //   const nursesRes = await fetch("/api/nurses");
    //   const nursesData = await nursesRes.json();
    //   setNurses(nursesData);
    //   const servicesRes = await fetch("/api/services");
    //   const servicesData = await servicesRes.json();
    //   setServices(servicesData);
    // };
    // fetchData();
    // For now, we'll just use the dummy data
  }, []);

  const handleAddMajor = (newMajor: Major) => {
    setMajors([...majors, newMajor]);
  };
  const handleAddService = (newService: Services) => {
    setServices([...services, newService]);
  };

  const handleDeleteService = (serviceId: number) => {
    setServices(services.filter((service) => service.id !== serviceId));
  };

  const handleAddNurse = (newNurse: NurseService) => {
    setNurses([...nurses, newNurse]);
  };

  // Function to handle deleting a nurse
  const handleDeleteNurse = (nurseId: number) => {
    setNurses(nurses.filter((nurse) => nurse.id !== nurseId));
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4">
        <MajorList
          majors={majors}
          selectedMajorId={selectedMajorId}
          onSelectMajor={setSelectedMajorId}
          onAddMajor={handleAddMajor}
        />
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="w-3/4 flex flex-col">
        <div className="h-1/2">
        <NurseList
            nurses={filteredNurses}
            onAddNurse={handleAddNurse}
            onDeleteNurse={handleDeleteNurse}
          />
        </div>
        <Separator orientation="horizontal" />
        <div className="h-1/2">
          <ServiceList
            services={filteredServices}
            onAddService={handleAddService}
            onDeleteService={handleDeleteService}
          />
        </div>
      </div>
    </div>
  );
}

export default ServiceManagementPage;
