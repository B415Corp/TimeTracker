import { useGetTasksByProjectQuery, useGetTaskStatusColumnQuery } from "@/shared/api/task.service";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@ui/table";
import TaskCardTable from "./task-cards/task-card-table.root";

/**
 * Feature-компонент: таблица задач с бизнес-логикой и работой с API
 * @param projectId string
 */
export function TasksListTableFeature({ projectId }: { projectId: string }) {
  const { data: tasks = [], isLoading: isTasksLoading } = useGetTasksByProjectQuery(projectId, {
    skip: !projectId,
    pollingInterval: 15000,
  });
  const { data: columns = [], isLoading: isColumnsLoading } = useGetTaskStatusColumnQuery(projectId, {
    skip: !projectId,
  });

  const isLoading = isTasksLoading || isColumnsLoading;

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <span>Загрузка таблицы...</span>
      </div>
    );
  }

  return (
    <div className="flex p-4">
      <Table className="flex-1 w-full ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[1/6]"></TableHead>
            <TableHead className="w-[1/6]">Наименование</TableHead>
            <TableHead className="w-[1/6]">Статус</TableHead>
            <TableHead className="w-[1/6]">Дата</TableHead>
            <TableHead className="w-[1/8]">Пользователи</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="flex-1">
          {tasks &&
            tasks.map((el) => {
              return (
                <TaskCardTable.Root
                  key={el.task_id}
                  task={el}
                  statusColumns={columns}
                >
                  <TaskCardTable.Items />
                  <TaskCardTable.Title />
                  <TaskCardTable.Status />
                  <TaskCardTable.Date />
                  <TaskCardTable.Users />
                  <TaskCardTable.DropdownMenu />
                </TaskCardTable.Root>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
} 