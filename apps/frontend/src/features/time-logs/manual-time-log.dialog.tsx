import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { useState } from "react";
import { usePostTimeLogManualMutation } from "@/shared/api/time-log.service";

interface ManualTimeLogDialogProps {
  task_id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog-форма для ручного ввода затраченного времени.
 * Позволяет указать часы, минуты и секунды, которые будут сохранены в качестве готового лога (status = completed).
 * @component
 */
export default function ManualTimeLogDialog({
  task_id,
  open,
  onOpenChange,
}: ManualTimeLogDialogProps) {
  const [hours, setHours] = useState<string>("0");
  const [minutes, setMinutes] = useState<string>("0");
  const [seconds, setSeconds] = useState<string>("0");

  const [createLog, { isLoading }] = usePostTimeLogManualMutation();

  function handleSubmit() {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    const durationMs = (h * 3600 + m * 60 + s) * 1000;

    if (durationMs <= 0) return;

    createLog({ task_id, duration: durationMs }).then(() => {
      onOpenChange(false);
      setHours("0");
      setMinutes("0");
      setSeconds("0");
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить фиксированное время</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 items-center justify-center my-4">
          <Input
            type="number"
            min="0"
            placeholder="ч"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-16 text-center"
          />
          <span>:</span>
          <Input
            type="number"
            min="0"
            placeholder="м"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-16 text-center"
          />
          <span>:</span>
          <Input
            type="number"
            min="0"
            placeholder="с"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            className="w-16 text-center"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 