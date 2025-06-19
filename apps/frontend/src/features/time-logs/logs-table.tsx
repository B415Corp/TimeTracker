"use client";

import { PaginatedResponse } from "@/shared/interfaces/api.interface";
import { TimeLog } from "@/entities/timer/timer.interface";
import { formatMilliseconds } from "@/lib/format-seconds";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@ui/table";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteTimeLogMutation } from "@/shared/api/time-log.service";
import EditTimeLogDialog from "./edit-time-log.dialog";
import { useState } from "react";

interface Props {
  logs: PaginatedResponse<TimeLog>;
  onPageChange?: (page: number) => void;
  canEdit?: boolean;
}

export function LogsTable({ logs, onPageChange, canEdit }: Props) {
  const data = logs?.data || [];
  const meta = logs?.meta;

  const [editingLog, setEditingLog] = useState<TimeLog | null>(null);
  const [deleteLog] = useDeleteTimeLogMutation();

  const totalCols = canEdit ? 5 : 4;

  return (
    <>
      <Table>
        <TableCaption>Список временных отметок</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Старт</TableHead>
            <TableHead className="w-[20%]">Остановка</TableHead>
            <TableHead className="w-[20%]">Длительность</TableHead>
            <TableHead className="w-[40%]">Пользователь</TableHead>
            {canEdit && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((log) => {
            const start = new Date(log.start_time).toLocaleString();
            const end = new Date(log.end_time).toLocaleString();
            const durationObj = formatMilliseconds(Number(log.duration));
            const duration = `${durationObj.hours}:${durationObj.minutes}:${durationObj.seconds}`;
            const userDisplay = log.user ? log.user.name : log.user_id;
            return (
              <TableRow key={log.log_id}>
                <TableCell>{start}</TableCell>
                <TableCell>{end}</TableCell>
                <TableCell>{duration}</TableCell>
                <TableCell>{userDisplay}</TableCell>
                {canEdit && (
                  <TableCell className="flex gap-2">
                    <button onClick={() => setEditingLog(log)}>
                      <PencilIcon className="size-4" />
                    </button>
                    <button onClick={() => deleteLog({ log_id: log.log_id })}>
                      <TrashIcon className="size-4" />
                    </button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={totalCols} className="text-center text-muted-foreground">
                Нет данных
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {meta && (
        <div className="flex justify-between items-center py-2">
          <button
            disabled={meta.page === 1}
            onClick={() => onPageChange && onPageChange(meta.page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Назад
          </button>
          <span>
            Страница {meta.page} из {meta.totalPages}
          </span>
          <button
            disabled={meta.page >= meta.totalPages}
            onClick={() => onPageChange && onPageChange(meta.page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Вперёд
          </button>
        </div>
      )}

      {canEdit && (
        <EditTimeLogDialog
          log={editingLog}
          open={editingLog !== null}
          onOpenChange={() => setEditingLog(null)}
        />
      )}
    </>
  );
}
