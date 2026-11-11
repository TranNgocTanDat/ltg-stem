import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import MasterLayout from "../layout/MasterLayout/MasterLayout";
import BlocklyPage from "@/blockly/BlocklyPage";
import Home from "@/blockly/Page/HomePage";
import LmsRoot from "@/components/lms/LmsRoot";
import LmsLayout from "@/components/lms/LmsLayout";
import { ProtectedRoute } from "@/components/lms/ProtectedRoute";
import LoginPage from "@/pages/lms/LoginPage";
import DashboardPage from "@/pages/lms/DashboardPage";
import LessonsPage from "@/pages/lms/LessonsPage";
import LessonDetailPage from "@/pages/lms/LessonDetailPage";
import QuizListPage from "@/pages/lms/QuizListPage";
import QuizTakePage from "@/pages/lms/QuizTakePage";
import AdminUsersPage from "@/pages/lms/AdminUsersPage";
import AdminClassesPage from "@/pages/lms/AdminClassesPage";
import AdminLessonsPage from "@/pages/lms/AdminLessonsPage";
import AdminQuestionsPage from "@/pages/lms/AdminQuestionsPage";
import AdminQuizzesPage from "@/pages/lms/AdminQuizzesPage";
import TeacherClassesPage from "@/pages/lms/TeacherClassesPage";
import TeacherClassPage from "@/pages/lms/TeacherClassPage";

const route = createBrowserRouter([
  {
    path: "/",
    element: <MasterLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/editor-blockly", element: <BlocklyPage /> },

    ],
  },
  {
    path: "/lms",
    element: <LmsRoot />,
    children: [
      { path: "login", element: <LoginPage /> },
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        element: (
          <ProtectedRoute>
            <LmsLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "lessons", element: <LessonsPage /> },
          { path: "lessons/:id", element: <LessonDetailPage /> },
          { path: "quizzes", element: <QuizListPage /> },
          { path: "quizzes/:id", element: <QuizTakePage /> },
          {
            path: "admin/users",
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminUsersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/classes",
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminClassesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/lessons",
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLessonsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/questions",
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminQuestionsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/quizzes",
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminQuizzesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "teacher/classes",
            element: (
              <ProtectedRoute allowedRoles={["TEACHER", "ADMIN"]}>
                <TeacherClassesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "teacher/classes/:id",
            element: (
              <ProtectedRoute allowedRoles={["TEACHER", "ADMIN"]}>
                <TeacherClassPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

const AppRoute = () => <RouterProvider router={route} />;

export default AppRoute;
