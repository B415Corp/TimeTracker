import { useParams } from "react-router-dom";
import { ProjectDetailFeature } from "@/features/project/ProjectDetailFeature";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <ProjectDetailFeature projectId={id} />;
};

export default ProjectDetailPage;
