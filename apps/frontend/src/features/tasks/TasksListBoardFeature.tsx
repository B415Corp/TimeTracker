import { useGetTasksByProjectQuery, useGetTaskStatusColumnQuery } from "@/shared/api/task.service";
import { KanbanBoard } from "./kanban/KanbanBoard";

/**
 * Feature-компонент: канбан-доска задач с бизнес-логикой и работой с API
 * @param projectId string
 */
export function TasksListBoardFeature({ projectId }: { projectId: string }) {
  const { data: columns = [], isLoading: isColumnsLoading } = useGetTaskStatusColumnQuery(projectId, {
    skip: !projectId,
    pollingInterval: 15000,
  });
  const { data: tasks = [], isLoading: isTasksLoading } = useGetTasksByProjectQuery(projectId, {
    skip: !projectId,
    pollingInterval: 15000,
  });

  const isLoading = isColumnsLoading || isTasksLoading;

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <span>Загрузка доски...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex w-full h-full p-4">
      <KanbanBoard initialColumns={columns} initialTasks={tasks} />
    </div>
  );
} 