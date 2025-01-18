import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => {
  const location = useLocation();

  // Define the routes where Navbar and Footer should not appear
  const noHeaderFooterRoutes = ["/login", "/signup", "/verify-otp"];

  const hideHeaderFooter = noHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      <Outlet />
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default Layout;
