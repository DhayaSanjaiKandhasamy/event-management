import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { AuthContextProvider } from "./Context/AuthContext";

function App() {
  return (
    <div>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  );
}

export default App;