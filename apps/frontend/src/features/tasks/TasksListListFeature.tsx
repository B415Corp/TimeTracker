import { useGetTasksByProjectQuery } from "@/shared/api/task.service";
import TaskListItemFeature from "./view-mod/task-list-item.feature";

/**
 * Feature-компонент: список задач с бизнес-логикой и работой с API
 * @param projectId string
 */
export function TasksListListFeature({ projectId }: { projectId: string }) {
  const { data: tasks } = useGetTasksByProjectQuery(projectId, {
    skip: !projectId,
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="flex flex-wrap gap-4 h-full w-full overflow-y-auto p-4">
      {tasks &&
        tasks?.map((el) => {
          return <TaskListItemFeature key={el.task_id} {...el} />;
        })}
    </div>
  );
} 