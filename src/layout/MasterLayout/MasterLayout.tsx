import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

const MasterLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Outlet />
  
    </div>
  );
};

export default MasterLayout;
