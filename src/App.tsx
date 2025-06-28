
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import TenantDashboard from "./pages/TenantDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardRedirect = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.role) {
    case 'tenant':
      return <Navigate to="/tenant" replace />;
    case 'owner':
      return <Navigate to="/owner" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route
              path="/tenant"
              element={
                <ProtectedRoute allowedRoles={['tenant']}>
                  <TenantDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
