import { useParams } from "react-router-dom";
import { TasksListTableFeature } from "@/features/tasks/TasksListTableFeature";

export function TasksListTablePage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <TasksListTableFeature projectId={id} />;
}
