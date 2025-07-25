import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { SimpleHeader } from "@/components/simple-header";

// Simple KTU Business Hub Pages
import SimpleHome from "./pages/simple-home";
import SimpleBusinesses from "./pages/simple-businesses";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import BuyerDashboard from "@/pages/buyer-dashboard";
import VendorDashboard from "@/pages/vendor/vendor-dashboard";
import VendorSettings from "@/pages/vendor/settings";
import AdminLogin from "./pages/admin/admin-login";
import AdminDashboard from "./pages/admin/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Main Pages */}
      <Route path="/" component={SimpleHome} />
      <Route path="/businesses" component={SimpleBusinesses} />
      
      {/* Authentication */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      
      {/* User Dashboards */}
      <Route path="/dashboard" component={BuyerDashboard} />
      <Route path="/vendor/dashboard" component={VendorDashboard} />
      <Route path="/vendor/settings" component={VendorSettings} />
      
      {/* Admin */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <SimpleHeader />
            <main>
              <Router />
            </main>
          </div>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;