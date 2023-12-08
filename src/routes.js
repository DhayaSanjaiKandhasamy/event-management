import { createBrowserRouter } from "react-router-dom";

import HomePage from "./Containers/HomePage/HomePage";
import MahalDetails from "./Containers/MahalDetails/MahalDetails";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import Bookings from "./Containers/Bookings/Bookings";

const Layout = ({ component }) => (
  <>
    <NavBar /> {component} <Footer />
  </>
);
const router = createBrowserRouter([
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
