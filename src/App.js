import { RouterProvider } from "react-router-dom";

import Footer from "./Components/Footer/Footer";
import NavBar from "./Components/NavBar/NavBar";
import router from "./routes";

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
