import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { useState, useEffect } from "react";
import { TimeLog } from "@/entities/timer/timer.interface";
import { useUpdateTimeLogMutation } from "@/shared/api/time-log.service";
import { formatMilliseconds } from "@/lib/format-seconds";

interface EditTimeLogDialogProps {
  log: TimeLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditTimeLogDialog({ log, open, onOpenChange }: EditTimeLogDialogProps) {
  function toLocalInput(dt?: string) {
    if (!dt) return "";
    return new Date(dt).toISOString().slice(0, 16);
  }

  const initialDuration = log ? formatMilliseconds(Number(log.duration)) : { hours: "00", minutes: "00", seconds: "00" };
  const [duration, setDuration] = useState<string>(`${initialDuration.hours}:${initialDuration.minutes}:${initialDuration.seconds}`);

  const [error] = useState<string>("");

  const [updateLog, { isLoading }] = useUpdateTimeLogMutation();

  function parseDuration(value: string) {
    const parts = value.split(":").map((n) => parseInt(n));
    if (parts.length !== 3) return 0;
    return ((parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0)) * 1000;
  }

  async function handleSave() {
    if (!log) return;
    await updateLog({
      log_id: log.log_id,
      data: {
        duration: parseDuration(duration),
      },
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать лог</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm">Duration (HH:MM:SS)</label>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <p className="text-xs text-muted-foreground">Старт: {log && new Date(log.start_time).toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Остановка: {log && new Date(log.end_time).toLocaleString()}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button onClick={handleSave} disabled={isLoading}>Сохранить</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 