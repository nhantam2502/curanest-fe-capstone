"use client"

import * as React from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BirthDatePicker() {
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: 100 }, 
    (_, index) => currentYear - index
  )

  const handleYearSelect = (yearStr: string) => {
    const year = parseInt(yearStr)
    setSelectedYear(year)
    setDate(undefined)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedYear && selectedDate) {
      const adjustedDate = new Date(
        selectedYear, 
        selectedDate.getMonth(), 
        selectedDate.getDate()
      )
      setDate(adjustedDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày sinh</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select onValueChange={handleYearSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn năm sinh" />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-[300px] overflow-y-auto">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedYear && (
          <div className="rounded-md border">
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={handleDateSelect}
              disabled={(date) => 
                date.getFullYear() !== selectedYear
              }
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}