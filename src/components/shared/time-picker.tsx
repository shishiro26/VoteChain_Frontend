import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  setTime: (hours: number, minutes: number) => void;
  date?: Date;
}

export function TimePicker({ setTime, date }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  const to12Hour = (h: number) => {
    const hr = h % 12;
    return hr === 0 ? 12 : hr;
  };

  const [hour, setHour] = React.useState<number>(
    date ? to12Hour(date.getHours()) : 12
  );
  const [minute, setMinute] = React.useState<number>(
    date ? date.getMinutes() : 0
  );
  const [isPM, setIsPM] = React.useState<boolean>(
    date ? date.getHours() >= 12 : false
  );

  React.useEffect(() => {
    if (date) {
      setHour(to12Hour(date.getHours()));
      setMinute(date.getMinutes());
      setIsPM(date.getHours() >= 12);
    }
  }, [date]);

  const to24Hour = (h: number, isPM: boolean) => {
    if (isPM) return h === 12 ? 12 : h + 12;
    return h === 12 ? 0 : h;
  };

  const updateTime = (h: number, m: number, pm: boolean) => {
    const newHour24 = to24Hour(h, pm);
    setTime(newHour24, m);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1 || value > 12) return;
    setHour(value);
    updateTime(value, minute, isPM);

    if (e.target.value.length >= 2) {
      minuteRef.current?.focus();
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0 || value > 59) return;
    setMinute(value);
    updateTime(hour, value, isPM);
  };

  const toggleAMPM = () => {
    setIsPM((prev) => {
      const newPM = !prev;
      updateTime(hour, minute, newPM);
      return newPM;
    });
  };

  const formattedHour = String(hour).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");

  return (
    <div className="flex items-center space-x-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <Input
          ref={hourRef}
          id="hours"
          className="w-16 text-center"
          value={formattedHour}
          onChange={handleHourChange}
          type="number"
          min={1}
          max={12}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <Input
          ref={minuteRef}
          id="minutes"
          className="w-16 text-center"
          value={formattedMinute}
          onChange={handleMinuteChange}
          type="number"
          min={0}
          max={59}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="ampm" className="text-xs">
          AM/PM
        </Label>
        <button
          id="ampm"
          type="button"
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium",
            "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
          onClick={toggleAMPM}
        >
          {isPM ? "PM" : "AM"}
        </button>
      </div>
    </div>
  );
}
