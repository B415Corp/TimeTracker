import { useParams } from "react-router-dom";
import { TasksListBoardFeature } from "@/features/tasks/TasksListBoardFeature";

export function TasksListBoardPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <TasksListBoardFeature projectId={id} />;
}
