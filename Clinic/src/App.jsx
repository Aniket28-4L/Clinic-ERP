import { Navigate, Route, Routes } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

import { useAuth } from "./app/providers/AuthProvider";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AdminDashboard } from "./pages/dashboards/AdminDashboard";
import { DoctorDashboard } from "./pages/dashboards/DoctorDashboard";
import { ReceptionDashboard } from "./pages/dashboards/ReceptionDashboard";
import { PatientsPage } from "./pages/patients/PatientsPage";
import { AppointmentCalendarPage } from "./pages/appointments/AppointmentCalendarPage";
import { PrescriptionsPage } from "./pages/prescriptions/PrescriptionsPage";
import { BillingPage } from "./pages/billing/BillingPage";
import { InventoryPage } from "./pages/pharmacy/InventoryPage";
import { InventoryTransactionsPage } from "./pages/pharmacy/InventoryTransactionsPage";
import { DoctorsPage } from "./pages/doctors/DoctorsPage";
import { ReportsPage } from "./pages/ReportsPage";

function Protected({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppIndex() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "doctor") return <Navigate to="/doctor" replace />;
  if (user.role === "receptionist") return <Navigate to="/reception" replace />;
  if (user.role === "pharmacist") return <Navigate to="/pharmacy/inventory" replace />;
  return <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <Protected>
            <DashboardLayout />
          </Protected>
        }
      >
        <Route index element={<AppIndex />} />

        <Route path="admin" element={<AdminDashboard />} />
        <Route path="doctor" element={<DoctorDashboard />} />
        <Route path="reception" element={<ReceptionDashboard />} />

        <Route path="patients" element={<PatientsPage />} />
        <Route path="appointments" element={<AppointmentCalendarPage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="pharmacy/inventory" element={<InventoryPage />} />
        <Route path="pharmacy/transactions" element={<InventoryTransactionsPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
