import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AdminOptions from "./pages/AdminOptions";
import UserManagement from "./pages/UserManegement";
import OrdersManagement from "./pages/OrdersManagement";
import BroadcastCenter from "./pages/BroadcastCenter";
import CategoryManagement from "./pages/CategoryManagement";
import SubCategoryManagement from "./pages/SubCategoryManagement";
import BrandManagement from "./pages/BrandManagement";
import AdminCupon from "./pages/AdminCupon";
import FestivalBannerManagement from "./pages/FestivalBannerManagement";
import FestivalProductsPage from "./pages/FestivalProductsPage.jsx";
// =========================
// LAYOUTS
// =========================

import AdminLayout from "./layout/AdminLayout";
import SentEmails from "./pages/SentEmails";
import ProductManagement from "./pages/ProductManagement";
import UserProfile from "./pages/UserProfile";

import Header from "./layout/Header.jsx";

// ============ AUTH GUARD COMPONENTS ============

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();
  return !!token && !!user && token !== "null" && token !== "undefined";
};

const isAdmin = () => {
  const user = getStoredUser();
  return user?.role === "ADMIN" || user?.role === "admin";
};

// Redirect authenticated users away from login/register
function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
}

// Protect routes that require login
function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ============ APP COMPONENT ============

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

                <Route
  path="/festival-products/:id"
  element={<FestivalProductsPage />}
/>
        
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="userManagement" element={<UserManagement />} />
          <Route path="productManagement" element={<ProductManagement />} />
          <Route path="orderManagement" element={<OrdersManagement />} />
          <Route path="couponManagement" element={<AdminCupon/>}/>
           <Route path="options" element={<AdminOptions />} />
           <Route
  path="festivalBannerManagement"
  element={
    <FestivalBannerManagement />
  }
/>
          <Route
            path="categoryManagement"
            element={<CategoryManagement />}
          />

          {/* Sub Categories */}
          <Route
            path="subCategoryManagement"
            element={<SubCategoryManagement />}
          />

          {/* Brands */}
          <Route
            path="brandManagement"
            element={<BrandManagement />}
          />


          <Route path="broadcast" element={<BroadcastCenter />} />
          <Route path="sent-emails" element={<SentEmails />} />
          {/* DEFAULT ADMIN ROUTE */}

          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="/admin/profile" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminProfile />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;