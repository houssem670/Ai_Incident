import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Incidents from "./pages/Incidents";
import IncidentDetails from "./pages/IncidentDetails";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import SetupAdmin from "./pages/SetupAdmin";
import UsersManagement from "./pages/UsersManagement";

import { getSetupStatus } from "./services/setupService";
import Alerts from "./pages/alerts/Alerts";
import Reports from "./pages/Reports";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(true);

  useEffect(() => {
    async function checkSetup() {
      try {
        const response = await getSetupStatus();
        setAdminExists(response.admin_exists);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    checkSetup();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {!adminExists ? (
        <Routes>
          <Route path="*" element={<SetupAdmin />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/incidents" element={<Incidents />} />
                    <Route path="/incidents/:id" element={<IncidentDetails />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/users" element={<UsersManagement />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/reports" element={<Reports />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}