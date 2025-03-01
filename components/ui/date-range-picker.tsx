"\"use client"
import { Calendar } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarPrimitive } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  date: { from?: Date; to?: Date } | undefined
  setDate: (date: { from?: Date; to?: Date } | undefined) => void
}

function DatePickerWithRange({ date, setDate }: DatePickerWithRangeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              `${date.from?.toLocaleDateString()} - ${date.to?.toLocaleDateString()}`
            ) : (
              `${date.from?.toLocaleDateString()} - Início`
            )
          ) : (
            <span>Escolha um período</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center" side="bottom">
        <CalendarPrimitive
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          pagedNavigation
          className="border-0 shadow-md"
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePickerWithRange }

