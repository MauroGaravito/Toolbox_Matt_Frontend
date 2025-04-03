import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";
import PrivateRoute from "./components/PrivateRoute";
import ToolboxTalks from "./pages/ToolboxTalks";
import ToolboxTalkDetail from "./pages/ToolboxTalkDetail"; // asegúrate de tener este import
import ToolboxTalkPreview from "./pages/ToolboxTalkPreview";


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/toolbox-talks"
          element={
            <PrivateRoute>
              <ToolboxTalks />
            </PrivateRoute>
          }
        />
        <Route 
          path="/toolbox-talks/:id" 
          element={
            <PrivateRoute>
              <ToolboxTalkDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/toolbox-talks/:id/preview"
          element={
            <PrivateRoute>
              <ToolboxTalkPreview />
            </PrivateRoute>
          }
        />
           
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}
