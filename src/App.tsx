import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/contexts/StoreContext";

// Public pages
import Index from "./pages/Index";
import Produits from "./pages/Produits";
import ProductDetails from "./pages/ProductDetails";
import Panier from "./pages/Panier";
import Ordonnance from "./pages/Ordonnance";
import Localisation from "./pages/Localisation";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProduits from "./pages/admin/AdminProduits";
import AdminCommandes from "./pages/admin/AdminCommandes";
import AdminLivraison from "./pages/admin/AdminLivraison";
import AdminOrdonnances from "./pages/admin/AdminOrdonnances";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/produit/:id" element={<ProductDetails />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/ordonnance" element={<Ordonnance />} />
            <Route path="/localisation" element={<Localisation />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/produits" element={<AdminProduits />} />
            <Route path="/admin/commandes" element={<AdminCommandes />} />
            <Route path="/admin/livraison" element={<AdminLivraison />} />
            <Route path="/admin/ordonnances" element={<AdminOrdonnances />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  </QueryClientProvider>
);

export default App;
