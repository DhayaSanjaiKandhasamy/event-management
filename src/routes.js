import { createBrowserRouter } from "react-router-dom";

import HomePage from "./Containers/HomePage/HomePage";
import MahalDetails from "./Containers/MahalDetails/MahalDetails";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import Bookings from "./Containers/Bookings/Bookings";
import ProtectedRoutes from "./Components/Utilities/ProtectedRoutes";
import Login from "./Containers/Login/Login";
const Layout = ({ component }) => (
  <ProtectedRoutes>
    <NavBar /> {component} <Footer />
  </ProtectedRoutes>
);
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/",
    element: <Layout component={<HomePage />} />,
  },

  {
    path: "mahal/:mahalId",
    element: <Layout component={<MahalDetails />} />,
  },

  {
    path: "mahal/:mahalId/bookings",
    element: <Layout component={<Bookings />} />,
  },

  {
    path: "about",
    element: <div>About</div>,
  },
]);

export default router;
