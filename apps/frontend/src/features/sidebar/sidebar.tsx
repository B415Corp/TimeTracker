import { CONTACTS_VIEW, ROUTES } from "@/app/router/routes.enum";
import { NavUser } from "@/components/nav-user";
import { Collapsible, CollapsibleContent } from "@ui/collapsible";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarMenu,
  Sidebar,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@ui/sidebar";
import { useGetUserQuery } from "@/shared/api/user.service";
import SearchWidget from "@/widgets/search.widget";
import {
  Home,
  Clock,
  FolderGit2,
  ContactRound,
  List,
  ReceiptText,
  NotebookPen,
  FolderCode,
} from "lucide-react";
import { Link } from "react-router";
import SidebarItemFeature from "./sidebar-item";
import { useGetFriendshipMeQuery } from "@/shared/api/friendship.service";
import UserAvatar from "@/components/user-avatar";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useSearcV2Query } from "@/shared/api/search.service";

export default function SidebarFeature() {
  const { data: user } = useGetUserQuery();
  const { data: friends } = useGetFriendshipMeQuery();
  const { data: searchData } = useSearcV2Query({ searchLocation: "projects" });
  const projects = searchData?.projects;

  return (
    <Sidebar className="h-full">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span className="text-lg font-semibold">TimeTracker</span>
          </div>
          <SearchWidget
            searchLocationList={[
              "all",
              "projects",
              "tasks",
              "clients",
              "users",
            ]}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarItemFeature
                tooltip={"Главная"}
                pathname={"/"}
                isIncludePath={false}
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                  <span>Главная</span>
                </Link>
              </SidebarItemFeature>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FolderGit2 className="h-4 w-4" />
                  <span>Проекты</span>
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton>
                        <Link
                          className="flex items-center gap-2 w-full"
                          to={`/${ROUTES.PROJECTS}`}
                        >
                          <List className="h-4 w-4" />
                          <span>Все проекты</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                    {projects?.slice(0, 5)?.map((_el) => (
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Link
                            to={`/${ROUTES.PROJECTS}/${_el.project_id}`}
                            className="flex items-center gap-2"
                          >
                            <FolderCode className="h-4 w-4" />
                            {_el.name}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ContactRound className="h-4 w-4" />
                  <span>Контакты</span>
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton>
                        <Link
                          className="flex items-center gap-2"
                          to={`/${ROUTES.CONTACTS}/${CONTACTS_VIEW.CLIENTS}`}
                        >
                          <List className="h-4 w-4" />
                          <span>Все контакты</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                    {friends?.slice(0, 5)?.map((friend) => (
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Link
                            to={`/${ROUTES.USER}/${friend?.friend?.user_id}`}
                            className="flex items-center gap-2"
                          >
                            <UserAvatar
                              name={friend?.friend?.name || ""}
                              planId={SUBSCRIPTION.FREE}
                              size={"xxs"}
                            />
                            {friend.friend.name}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>

              <SidebarItemFeature
                tooltip={"Заметки"}
                pathname={`/${ROUTES.NOTES}`}
              >
                <Link to={`/${ROUTES.NOTES}`}>
                  <NotebookPen className="h-4 w-4" />
                  <span>Заметки</span>
                </Link>
              </SidebarItemFeature>
              <SidebarItemFeature
                tooltip={"Счета"}
                pathname={`/${ROUTES.BILLING}`}
              >
                <Link to={`/${ROUTES.BILLING}`}>
                  <ReceiptText className="h-4 w-4" />
                  <span>Счета</span>
                </Link>
              </SidebarItemFeature>
            </SidebarMenu>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          name={user?.name || "user"}
          email={user?.email || "email"}
          avatar="/avatars/shadcn.jpg"
          user_id={user?.user_id || "user_id"}
        />
        <div className="px-2 py-2 text-xs text-muted-foreground">
          © 2025 TimeTracker B415
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
