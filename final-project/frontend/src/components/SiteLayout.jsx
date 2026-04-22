import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

function SiteLayout() {
  return (
    <div className="container">
      <Header title="Varaosa kauppa" />
      <NavBar />
      <Outlet />
      <Footer text="© Varaosa kauppa 2025" />
    </div>
  );
}

export default SiteLayout;
