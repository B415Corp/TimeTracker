import { useParams } from "react-router-dom";
import { TasksListListFeature } from "@/features/tasks/TasksListListFeature";

export function TasksListListPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <TasksListListFeature projectId={id} />;
}
