import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

const MasterLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="main min-h-[calc(100vh-4rem)]">
        <Outlet />
      </div>

    </div>
  );
};

export default MasterLayout;
