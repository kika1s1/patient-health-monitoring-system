import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter,Navigate, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Loader } from "lucide-react";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import DoctorProfilePage from "./pages/DoctorProfilePage";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import { ThemeProvider } from "./components/ThemeProvider";
import { NotificationProvider } from "./contexts/NotificationContext";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
    useEffect(()=>{
      checkAuth();
    }, [checkAuth]);
    if(isCheckingAuth && !authUser){
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
      )
    }
    console.log("Auth User:", authUser);
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={authUser ? <Index/> : <Navigate to="/login" />} />
                <Route path="/login" element={!authUser ? <Login/> : <Navigate to="/" />} />
                <Route path="/signup" element={!authUser ? <SignUp/> : <Navigate to="/" />} />
                <Route path="/profile" element={authUser ? <DoctorProfilePage />:<Navigate to="/login" />} />
                <Route path="/settings" element={authUser ?<Settings />:<Navigate to="/login" />} />
                <Route path="/messages" element={authUser ?<Messages />:<Navigate to="/login" />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
