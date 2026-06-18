import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./auth/ProtectedRoute";
import { CarsPage } from "./pages/CarsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cars" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/cars" element={<CarsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/cars" replace />} />
    </Routes>
  );
}

export default App;