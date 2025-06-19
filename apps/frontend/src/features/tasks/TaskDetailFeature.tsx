import { Button } from "@ui/button";
import {
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
} from "@/shared/api/task.service";
import { CalendarDays, ChevronLeft, HandCoins, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/dateUtils";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import UpdateTaskForm from "./forms/update-task.form";
import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { Separator } from "@ui/separator";
import { useGetTimeLogLogsQuery, usePostTimeLogManualMutation } from "@/shared/api/time-log.service";
import TaskSharedUsers from "./shared-users/task-shared-users";
import { useGetProjectSharedByIdQuery } from "@/shared/api/projects-shared.service";
import { LogsTable } from "../time-logs/logs-table";
import TimeLogsTimer from "../time-logs/time-logs-timer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/tabs";
import { Input } from "@ui/input";
import { formatMilliseconds } from "@/lib/format-seconds";

/**
 * Feature-компонент: детальная страница задачи с бизнес-логикой и работой с API
 * @param taskId string
 */
export function TaskDetailFeature({ taskId }: { taskId: string }) {
  const navigate = useNavigate();
  const [deleteTask] = useDeleteTaskMutation();
  const { data: task } = useGetTaskByIdQuery(taskId, { skip: !taskId });
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const { data: timeLogs } = useGetTimeLogLogsQuery(
    { task_id: taskId, page, limit },
    { skip: !taskId }
  );
  const { data: projectUsers } = useGetProjectSharedByIdQuery(
    { project_id: task?.project_id || "" },
    { skip: !task }
  );

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState<boolean>(false);
  const [durationInput, setDurationInput] = useState<string>("00:00:00");
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [createManualLog] = usePostTimeLogManualMutation();

  // Считаем общее затраченное время по логам
  const totalDurationMs =
    timeLogs?.data?.reduce((acc, log) => acc + Number(log?.duration || 0), 0) || 0;

  // Сохраняем общее время в строковом формате
  useEffect(() => {
    const d = formatMilliseconds(totalDurationMs);
    setDurationInput(`${d.hours}:${d.minutes}:${d.seconds}`);
  }, [totalDurationMs]);

  function parseHHMMSSToMs(value: string): number {
    const parts = value.split(":").map((p) => parseInt(p));
    if (parts.length !== 3) return 0;
    const [h, m, s] = parts;
    return ((h || 0) * 3600 + (m || 0) * 60 + (s || 0)) * 1000;
  }

  async function saveDuration() {
    const durationMs = parseHHMMSSToMs(durationInput);
    if (durationMs > 0) {
      await createManualLog({ task_id: taskId, duration: durationMs });
    }
    setIsDirty(false);
  }

  if (!task) return null;

  return (
    <>
      {/* Диалог редактирования */}
      <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать задачу</DialogTitle>
          </DialogHeader>
          <UpdateTaskForm
            onSuccess={() => setEditDialogIsOpen(false)}
            onClose={() => setEditDialogIsOpen(false)}
            defaults={{
              name: task.name,
              description: task.description,
              is_paid: task.is_paid,
              payment_type: task.payment_type,
              rate: String(task.rate),
              currency_id: String(task.currency.currency_id || ""),
            }}
            taskId={task?.task_id}
            currency={task?.currency}
          />
        </DialogContent>
      </Dialog>
      {/* Диалог удаления */}
      <Dialog open={taskToDelete !== null} onOpenChange={() => setTaskToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить эту задачу?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setTaskToDelete(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                navigate(`/${ROUTES.PROJECTS}/${TASKS_VIEW.TABLE}`);
                await deleteTask(taskId);
                setTaskToDelete(null);
              }}
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Основной UI */}
      <div className="w-full h-full flex flex-col">
        <div className="w-full">
          <div className="flex justify-between w-full">
            <div className="flex flex-col w-full">
              <div className="flex flex-row border-b-2 w-full p-4 justify-between items-center">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-4">
                    <Button
                      className="size-6"
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => navigate(-1)}
                    >
                      <ChevronLeft />
                    </Button>
                    <div className="flex gap-4 text-xl font-bold items-center">
                      <TimeLogsTimer.Root
                        task_id={task?.task_id || ''}
                        variant="icon"
                        showTime={true}
                      />
                      <Separator orientation="vertical" className="border-1 min-h-5" />
                      <p className="uppercase">{task?.name}</p>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex size-6 text-muted-foreground data-[state=open]:bg-muted ml-auto"
                              size="icon"
                            >
                              <MoreVerticalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setEditDialogIsOpen(true)}>
                              <PencilIcon className="mr-2 size-4" />
                              <span>Редактировать</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setTaskToDelete(taskId)}
                            >
                              <TrashIcon className="mr-2 size-4" />
                              <span>Удалить</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap text-gray-400 text-xs h-5 items-center">
                    <div className="flex items-center gap-2">
                      <HandCoins className="w-4 h-4" />
                      <p>
                        {task?.currency?.symbol}
                        {task?.rate}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="border-1" />
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <p>{formatDate(task?.created_at || "")}</p>
                    </div>
                    <Separator orientation="vertical" className="border-1 " />
                    <TaskSharedUsers
                      taskMembers={task?.taskMembers || []}
                      taskId={taskId}
                      projectMembers={projectUsers || []}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex overflow-hidden p-4 w-full h-full gap-4">
          <div className="w-full h-full flex flex-col">
            <Tabs defaultValue="time" className="h-full flex flex-col">
              <TabsList>
                <TabsTrigger value="notes">Заметки</TabsTrigger>
                <TabsTrigger value="time">Время</TabsTrigger>
              </TabsList>
              <TabsContent value="notes" className="p-4">
                <p className="text-muted-foreground">Раздел в разработке</p>
              </TabsContent>
              <TabsContent value="time" className="flex flex-col gap-4 overflow-auto p-4">
                {/* Редактируемое общее время */}
                <div className="flex items-center gap-2">
                  <Input
                    value={durationInput}
                    onChange={(e) => {
                      setDurationInput(e.target.value);
                      setIsDirty(true);
                    }}
                    onBlur={() => {
                      if (isDirty) saveDuration();
                    }}
                    className="w-32 text-center font-mono"
                  />
                  {isDirty && (
                    <Button size="sm" onClick={saveDuration}>Сохранить</Button>
                  )}
                </div>
                {/* Таблица логов */}
                <div className="overflow-auto">
                  {timeLogs && (
                    <LogsTable
                      logs={timeLogs}
                      onPageChange={(p) => setPage(p)}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
} 