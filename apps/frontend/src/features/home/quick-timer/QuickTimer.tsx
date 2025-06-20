import React, {useEffect, useState} from "react";
import {Button} from "@ui/button";
import {
  useGetTimeLogLatestQuery,
  usePostTimeLogStartMutation,
  usePostTimeLogStopMutation
} from "@/shared/api/time-log.service";
import dayjs from "dayjs";

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function QuickTimer() {
  const {data: latestLog, refetch} = useGetTimeLogLatestQuery();
  const [startLog] = usePostTimeLogStartMutation();
  const [stopLog] = usePostTimeLogStopMutation();
  const [elapsed, setElapsed] = useState(0);

  const isRunning = latestLog && !latestLog.end_time;

  // тикер для отображения времени
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const start = dayjs(latestLog?.start_time);
      setElapsed(dayjs().diff(start));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, latestLog]);

  const handleClick = async () => {
    if (!latestLog) return;
    if (isRunning) {
      await stopLog({task_id: latestLog.task_id, client_time: new Date().toISOString()});
    } else {
      await startLog({task_id: latestLog.task_id});
    }
    refetch();
  };

  if (!latestLog) return null; // нет данных

  return (
    <div className="flex items-center gap-4 mb-4">
      <Button onClick={handleClick}>
        {isRunning ? "Стоп" : "Старт"}
      </Button>
      {isRunning && <span className="font-mono">{formatDuration(elapsed)}</span>}
      <span className="text-muted-foreground">{latestLog.task?.name}</span>
    </div>
  );
} 