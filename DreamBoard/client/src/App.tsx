import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import DashboardPage from "@/pages/dashboard-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <HomePage />
      </Route>
      <ProtectedRoute 
        path="/dashboard/:id" 
        component={DashboardPage as React.ComponentType<any>} 
      />
      <Route path="/auth">
        <AuthPage />
      </Route>
      {/* Fallback to 404 */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
