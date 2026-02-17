import { FolderGit2, FolderCode, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { useSearcV2Query } from "@/shared/api/search.service";
import { useEffect, useState } from "react";
import CreateProjectForm from "@/features/project/forms/create-project.form";

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProjectSelect({ value, onChange }: ProjectSelectProps) {
  const { data: searchData, refetch } = useSearcV2Query({ searchLocation: "projects" });
  const projects = searchData?.projects || [];
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (projects.length > 0 && !value) {
      onChange(projects[0].project_id);
    }
  }, [projects, value, onChange]);

  const handleCreateSuccess = () => {
    refetch();
    setDialogOpen(false);
  };

  if (projects.length === 0) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-9 text-sm w-full justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Создать проект
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новый проект</DialogTitle>
          </DialogHeader>
          <CreateProjectForm
            onSuccess={handleCreateSuccess}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  const selectedProject = projects.find((p) => p.project_id === value);

  return (
    <div className="flex items-center gap-1 w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-sm flex-1">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4" />
            <SelectValue>
              {selectedProject?.name || "Выберите проект"}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.project_id} value={project.project_id}>
              <div className="flex items-center gap-2">
                <FolderCode className="h-4 w-4" />
                {project.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новый проект</DialogTitle>
          </DialogHeader>
          <CreateProjectForm
            onSuccess={handleCreateSuccess}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
