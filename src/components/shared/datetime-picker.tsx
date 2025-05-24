import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "./time-picker";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  date: string | undefined;
  setDate: (date: string | undefined) => void;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
}

export function DateTimePicker({
  date,
  setDate,
  disabled,
  disabledDates,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? new Date(date) : undefined
  );
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Sync incoming prop → internal state
  React.useEffect(() => {
    const parsed = date ? new Date(date) : undefined;
    if (
      (parsed && !selectedDate) ||
      (parsed && selectedDate && parsed.getTime() !== selectedDate.getTime()) ||
      (!parsed && selectedDate)
    ) {
      setSelectedDate(parsed);
    }
  }, [date]);

  // Sync internal state → external prop
  React.useEffect(() => {
    if (selectedDate) {
      const iso = selectedDate.toISOString();
      if (iso !== date) {
        setDate(iso);
      }
    } else if (date) {
      setDate(undefined);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      if (selectedDate) {
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
      }
      setSelectedDate(newDate);
    } else {
      setSelectedDate(undefined);
    }
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      setSelectedDate(newDate);
    }
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP p")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Date</Label>
            <Clock className="h-4 w-4 opacity-50" />
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={disabledDates || disabled}
          initialFocus
        />
        <div className="p-4 pt-0">
          <Label className="text-sm font-medium mb-2 block">Time</Label>
          <TimePicker setTime={handleTimeChange} date={selectedDate} />
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              onClick={() => setIsCalendarOpen(false)}
              className="ml-auto"
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
