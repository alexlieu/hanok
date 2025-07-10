import { Outlet } from "react-router-dom";
import MainNav from "../components/ui/MainNav";

const RootLayout: React.FC = () => {
  return (
    <>
      <MainNav />
      <main className="bg-default-bg">
        <Outlet />
      </main>
    </>
  );
};
export default RootLayout;
