import { Outlet } from "react-router-dom";
import { NaviBar } from "../components";

const MainLayout = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-64">
      <NaviBar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
