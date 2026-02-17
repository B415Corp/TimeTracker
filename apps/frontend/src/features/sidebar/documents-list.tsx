import { ROUTES } from "@/app/router/routes.enum";
import { useGetDocumentsByProjectQuery } from "@/shared/api/documentsApi";
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ui/sidebar";
import { NotebookPen, List, Loader2 } from "lucide-react";
import { Link } from "react-router";

interface DocumentsListProps {
  projectId: string;
}

export default function DocumentsList({ projectId }: DocumentsListProps) {
  const { data: documents, isLoading } = useGetDocumentsByProjectQuery(projectId);

  if (!projectId) {
    return null;
  }

  if (isLoading) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Загрузка документов...</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  const rootDocuments = documents?.filter((doc) => !doc.parent_document_id) || [];
  const displayDocuments = rootDocuments.slice(0, 5);

  if (rootDocuments.length === 0) {
    return null;
  }

  return (
    <SidebarMenuSub>
      <SidebarMenuSubItem>
        <SidebarMenuButton>
          <Link
            className="flex items-center gap-2 w-full"
            to={`/${ROUTES.PROJECTS}/${projectId}/${ROUTES.DOCUMENTS}`}
          >
            <List className="h-4 w-4" />
            <span>Все документы</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuSubItem>
      {displayDocuments.map((doc) => (
        <SidebarMenuItem key={doc.document_id}>
          <SidebarMenuButton>
            <Link
              to={`/${ROUTES.PROJECTS}/${projectId}/${ROUTES.DOCUMENTS}/${doc.document_id}`}
              className="flex items-center gap-2 w-full"
            >
              {doc.icon ? (
                <span className="h-4 w-4 flex items-center justify-center">
                  {doc.icon}
                </span>
              ) : (
                <NotebookPen className="h-4 w-4" />
              )}
              {doc.title}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenuSub>
  );
}
