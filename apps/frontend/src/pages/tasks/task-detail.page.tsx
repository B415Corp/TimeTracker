import { useParams } from "react-router-dom";
import { TaskDetailFeature } from "@/features/tasks/TaskDetailFeature";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <TaskDetailFeature taskId={id} />;
}
