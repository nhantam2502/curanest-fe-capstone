import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const CategorySearch = () => {
  return (
    <div className="mb-10 items-center flex flex-col gap-2">
      <h2 className="font-bold text-4xl tracking-wide">
        Search
        <span className="text-primary"> Nursing</span>
      </h2>

      <h2 className="text-gray-400 text-xl">
        Search Your Nursing and Book Appointment
      </h2>

      <div className="flex w-full mt-3 max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Search..." />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2"/> Search
        </Button>
      </div>
    </div>
  );
};

export default CategorySearch;
