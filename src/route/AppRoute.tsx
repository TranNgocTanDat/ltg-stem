import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MasterLayout from "../layout/MasterLayout/MasterLayout";
import HomePage from "../components/landing/page";
import BlocklyPage from "@/blockly/BlocklyPage";
import HomeBlockPage from "@/blockly/HomeBlockPage";

const route = createBrowserRouter([
  {
    path: "/",
    element: <MasterLayout />,
    children: [
      { path: "/", element: <HomeBlockPage /> },
      { path: "/editor-blockly", element: <BlocklyPage /> },

    ],
  },
]);

const AppRoute = () => <RouterProvider router={route} />;

export default AppRoute;
