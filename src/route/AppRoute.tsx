import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MasterLayout from "../layout/MasterLayout/MasterLayout";
import BlocklyEditor from "../blockly/BlockyEditor";

const route = createBrowserRouter([
  {
    path: "/",
    element: <MasterLayout />,
    children: [
      { path: "/", element: <BlocklyEditor /> },
    ],
  },
]);

const AppRoute = () => <RouterProvider router={route} />;

export default AppRoute;
