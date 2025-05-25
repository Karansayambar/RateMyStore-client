"use client";
import { AdminDashboard } from "./components/dashboard/admin-dashboard";
import { OwnerDashboard } from "./components/dashboard/owner-dashboard";
import { UserDashboard } from "./components/dashboard/user-dashboard";
import { LoginForm } from "./components/forms/login-form";
import { useAuth } from "./contexts/auth-context";
import "./App.css";
import "./index.css";
function App() {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "user":
      return <UserDashboard />;
    case "owner":
      return <OwnerDashboard />;
    default:
      return <LoginForm />;
  }
}

export default App;
