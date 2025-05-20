
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProductDetails from "./pages/ProductDetails";
import UserStore from "./pages/UserStore";
import SearchResults from "./pages/SearchResults";

// Dashboard Pages
import DashboardHome from "./pages/Dashboard/DashboardHome";
import ProductsList from "./pages/Dashboard/ProductsList";
import ProductForm from "./pages/Dashboard/ProductForm";
import ProfileSettings from "./pages/Dashboard/ProfileSettings";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          
          <Routes>
            {/* Public routes with navbar and footer */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/products/:id" element={
              <>
                <Navbar />
                <ProductDetails />
                <Footer />
              </>
            } />
            <Route path="/store/:userId" element={
              <>
                <Navbar />
                <UserStore />
                <Footer />
              </>
            } />
            <Route path="/search" element={
              <>
                <Navbar />
                <SearchResults />
                <Footer />
              </>
            } />

            {/* Auth routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={
              <>
                <Navbar />
                <NotFound />
                <Footer />
              </>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
