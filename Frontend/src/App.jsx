import { Navigate, Route, Routes } from "react-router-dom";

import CreateTask from "./pages/CreateTask";
import Dashboard from "./pages/Dashboard";
import EditTask from "./pages/EditTask";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks/create" element={<CreateTask />} />
        <Route path="/tasks/edit/:id" element={<EditTask />} />
      </Route>
    </Routes>
  );
}

export default App;
