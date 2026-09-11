import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MasterLayout from "../layout/MasterLayout/MasterLayout";
import BlocklyPage from "@/blockly/BlocklyPage";
import Home from "@/blockly/Page/HomePage";

const route = createBrowserRouter([
  {
    path: "/",
    element: <MasterLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/editor-blockly", element: <BlocklyPage /> },

    ],
  },
]);

const AppRoute = () => <RouterProvider router={route} />;

export default AppRoute;
