"use client"

import * as React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { cn } from "@/lib/utils"

export interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date | null) => void
  disabled?: boolean
  showOutsideDays?: boolean
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled = false,
  ...props
}: CalendarProps) {
  return (
    <DatePicker
      selected={selected}
      onChange={(date: Date | null) => onSelect?.(date)}
      disabled={disabled}
      className={cn(
        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      wrapperClassName="w-full"
      dateFormat="PPP"
      showPopperArrow={false}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }