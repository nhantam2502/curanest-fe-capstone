"use client";

import { Button } from "@/components/ui/button";
import SalaryTable from "./SalaryTable";
import { useState } from "react";

// Dummy data for initial testing (replace with actual data fetching)
interface SalaryData {
  id: number;
  employeeName: string;
  department: string;
  salary: number;
  currency: string;
  payFrequency: string;
  effectiveDate: Date;
}

const initialSalaries: SalaryData[] = [
  {
    id: 1,
    employeeName: "John Doe",
    department: "Sales",
    salary: 60000,
    currency: "USD",
    payFrequency: "Monthly",
    effectiveDate: new Date(2023, 10, 1),
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    department: "Engineering",
    salary: 80000,
    currency: "USD",
    payFrequency: "Monthly",
    effectiveDate: new Date(2023, 9, 15),
  },
];

export default function SalaryPage() {
  const [salaries, setSalaries] = useState<SalaryData[]>(initialSalaries);

  // You might want to replace these with actual API calls to fetch data
  const handleEditSalary = (salary: SalaryData) => {
    // Example: Navigate to an edit page
    // router.push(`/salary/${salary.id}/edit`);
    console.log("Edit salary:", salary);
  };

  const handleDeleteSalary = (salaryId: number) => {
    // Example: Delete salary from database
    // fetch(`/api/salaries/${salaryId}`, { method: 'DELETE' });
    setSalaries(salaries.filter((salary) => salary.id !== salaryId));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý lương</h1>
        {/* You can remove the Add Salary button if you don't need it */}
        {/* <Button>Add Salary</Button> */}
      </div>

      <SalaryTable
        salaries={salaries}
        onEdit={handleEditSalary}
        onDelete={handleDeleteSalary}
      />
    </div>
  );
}