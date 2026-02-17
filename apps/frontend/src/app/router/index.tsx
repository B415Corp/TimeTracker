import React from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import NoAccessPage from "@/pages/no-access.page";
import { CONTACTS_VIEW, ROUTES } from "./routes.enum";
import { ALL_SUBSCRIPTIONS, PAID_SUBSCRIPTIONS } from "@/shared/constants";
import {
  LoginPage,
  PlansPage,
  ProjectDetailPage,
  ProjectsPage,
  RegisterPage,
  SettingsPage,
  TaskDetailPage,
  UserPage,
  DocumentPage,
  DocumentsListPage,
} from "@/pages";
import ContactsPage from "@/pages/contacts/contacts.page";
import ClientsPage from "@/pages/contacts/clients.page";
import FriendsPage from "@/pages/contacts/friends.page";
import ClientDetailPage from "@/pages/clients/client-detail.page";
import OfflinePage from "@/pages/offline.page";
import ServerConnectionGuard from "@/widgets/ServerConnectionGuard";

const router = createBrowserRouter(
  [
    {
      path: ROUTES.AUTH,
      element: (
        <AuthLayout>
          <Outlet />
        </AuthLayout>
      ),
      children: [
        {
          path: ROUTES.LOGIN,
          element: <LoginPage />,
        },
        {
          path: ROUTES.REGISTER,
          element: <RegisterPage />,
        },
        {
          path: ROUTES.NO_ACCESS,
          element: <NoAccessPage />,
        },
      ],
    },
    {
      path: ROUTES.PLANS,
      element: (
        <PrivateRoute roles={ALL_SUBSCRIPTIONS}>
          <PlansPage />
        </PrivateRoute>
      ),
    },
    {
      path: ROUTES.HOME,
      element: (
        <ServerConnectionGuard>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </ServerConnectionGuard>
      ),
      children: [
        {
          path: "",
          element: <Navigate to={ROUTES.PROJECTS} replace />,
        },
        {
          path: ROUTES.PROJECTS,
          element: (
            <PrivateRoute roles={ALL_SUBSCRIPTIONS}>
              <ProjectsPage />
            </PrivateRoute>
          ),
        },
        {
          path: ROUTES.CONTACTS,
          element: <ContactsPage />,
          children: [
            {
              // clients
              path: CONTACTS_VIEW.CLIENTS,
              element: <ClientsPage />,
            },
            {
              // friends
              path: CONTACTS_VIEW.FRIENDS,
              element: <FriendsPage />,
            },
          ],
        },
        {
          path: ROUTES.PROJECTS + "/:id",
          element: (
            <PrivateRoute roles={ALL_SUBSCRIPTIONS}>
              <ProjectDetailPage />
            </PrivateRoute>
          ),
        },
        {
          path: ROUTES.PROJECTS + "/:projectId/" + ROUTES.DOCUMENTS,
          element: (
            <PrivateRoute roles={ALL_SUBSCRIPTIONS}>
              <DocumentsListPage />
            </PrivateRoute>
          ),
        },
        {
          path: ROUTES.PROJECTS + "/:projectId/" + ROUTES.DOCUMENTS + "/:documentId",
          element: (
            <PrivateRoute roles={ALL_SUBSCRIPTIONS}>
              <DocumentPage />
            </PrivateRoute>
          ),
        },
        {
          path: ROUTES.TASKS + "/:id",
          element: (
            <PrivateRoute roles={PAID_SUBSCRIPTIONS}>
              <TaskDetailPage />
            </PrivateRoute>
          ),
        },
        {
          path: ROUTES.USER + "/:id",
          element: (
            <PrivateRoute roles={ALL_SUBSCRIPTIONS}>
              <UserPage />
            </PrivateRoute>
          ),
        },
        {
          path: ROUTES.SETTINGS,
          element: (
            <PrivateRoute roles={ALL_SUBSCRIPTIONS}>
              <SettingsPage />
            </PrivateRoute>
          ),
        },
        {
          path: ROUTES.CLIENTS + "/:id",
          element: (
            <PrivateRoute roles={ALL_SUBSCRIPTIONS}>
              <ClientDetailPage />
            </PrivateRoute>
          ),
        },
        {
          path: "/" + ROUTES.OFFLINE,
          element: <OfflinePage />,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL || "/" }
);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
