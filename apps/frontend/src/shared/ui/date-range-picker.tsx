import * as React from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Input } from './input';
import { CalendarDays } from 'lucide-react';

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangePickerProps {
  date?: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ date, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const format = (d?: Date) =>
    d ? d.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }) : '––';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start">
          <CalendarDays className="mr-2 h-4 w-4" />
          {format(date?.from)} — {format(date?.to)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-2" align="start">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Начало</label>
          <Input
            type="date"
            value={date?.from ? new Date(date.from).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const newFrom = e.target.value ? new Date(e.target.value) : undefined;
              onChange({ from: newFrom, to: date?.to });
            }}
          />
          <label className="text-sm font-medium">Окончание</label>
          <Input
            type="date"
            value={date?.to ? new Date(date.to).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const newTo = e.target.value ? new Date(e.target.value) : undefined;
              onChange({ from: date?.from, to: newTo });
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
} 