import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';

export type DateRangePickerProps = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
};

/**
 * DateRangePicker – minimal accessible ISO datetime inputs. Keyboard-friendly.
 */
const DateRangePicker: React.FC<DateRangePickerProps> = ({ from, to, onChange }) => {
  const [localFrom, setLocalFrom] = useState<string>(() => toLocal(from));
  const [localTo, setLocalTo] = useState<string>(() => toLocal(to));

  const commit = () => {
    onChange(fromLocal(localFrom), fromLocal(localTo));
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted-foreground font-medium" htmlFor="from">From</label>
      <Input 
        id="from" 
        type="datetime-local" 
        value={localFrom} 
        onChange={(e) => setLocalFrom(e.target.value)} 
        onBlur={commit} 
        className="h-9 bg-background border-border focus:border-primary text-foreground" 
      />
      <label className="text-xs text-muted-foreground font-medium" htmlFor="to">To</label>
      <Input 
        id="to" 
        type="datetime-local" 
        value={localTo} 
        onChange={(e) => setLocalTo(e.target.value)} 
        onBlur={commit} 
        className="h-9 bg-background border-border focus:border-primary text-foreground" 
      />
    </div>
  );
};

export default DateRangePicker;

function toLocal(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocal(local: string): string {
  if (!local) return new Date().toISOString();
  const d = new Date(local);
  return d.toISOString();
}


