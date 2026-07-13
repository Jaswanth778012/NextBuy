import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// =========================
// PUBLIC PAGES
// =========================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FestivalProductsPage from "./pages/FestivalProductsPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import WishlistDetailsPage from "./pages/WishlistDetailsPage";
import WishlistAlertsPage from "./pages/WishlistAlertsPage";
import BillingPage from "./pages/BillingPage";

import UserProfile from "./pages/UserProfile";

// =========================
// ADMIN PAGES
// =========================

import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AdminOptions from "./pages/AdminOptions";
import UserManagement from "./pages/UserManagement";
import OrdersManagement from "./pages/OrdersManagement";
import BroadcastCenter from "./pages/BroadcastCenter";
import CategoryManagement from "./pages/CategoryManagement";
import SubCategoryManagement from "./pages/SubCategoryManagement";
import BrandManagement from "./pages/BrandManagement";
import AdminCupon from "./pages/AdminCupon";
import FestivalBannerManagement from "./pages/FestivalBannerManagement";
import ProductManagement from "./pages/ProductManagement";
import SentEmails from "./pages/SentEmails";
import SupportDashboardAdmin from "./pages/SupportDashboardAdmin";

// =========================
// LAYOUTS
// =========================

import PublicLayout from "./layout/PublicLayout";
import AdminLayout from "./layout/AdminLayout";

// =========================
// AUTH HELPERS
// =========================

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");

    if (!raw || raw === "null") {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  return (
    !!token &&
    !!user &&
    token !== "null" &&
    token !== "undefined"
  );
};

const isAdmin = () => {
  const user = getStoredUser();

  return (
    user?.role === "ADMIN" ||
    user?.role === "admin"
  );
};

const isUser = () => {
  const user = getStoredUser();

  return (
    user?.role === "USER" ||
    user?.role === "user"
  );
};

// =========================
// PUBLIC ROUTE
// =========================

function PublicRoute({ children }) {
  return isAuthenticated()
    ? <Navigate to="/" replace />
    : children;
}

// =========================
// PROTECTED ROUTE
// =========================

function ProtectedRoute({
  children,
  requireAdmin = false,
}) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// =========================
// USER ROUTE
// =========================

function UserRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (!isUser()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// =========================
// APP
// =========================

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <Routes>

        {/* =========================
            PUBLIC LAYOUT ROUTES
        ========================= */}

        <Route element={<PublicLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/festival-products/:id"
            element={<FestivalProductsPage />}
          />

          <Route
            path="/cart"
            element={
              <UserRoute>
                <CartPage />
              </UserRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <UserRoute>
                <UserProfile />
              </UserRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <UserRoute>
                <WishlistPage />
              </UserRoute>
            }
          />

          <Route
            path="/wishlist/:wishlistId"
            element={
              <UserRoute>
                <WishlistDetailsPage />
              </UserRoute>
            }
          />

          <Route
            path="/wishlist/alerts"
            element={
              <UserRoute>
                <WishlistAlertsPage />
              </UserRoute>
            }
          />

            {/* change by gowtham: added direct /billing route for Step-3 Billing page because AddressPage navigates to /billing */}
            <Route
              path="/billing"
              element={
                <UserRoute>
                  <BillingPage />
                </UserRoute>
              }
            />
            
            {/* change by gowtham: kept old /checkout/billing route and redirecting it to /billing to avoid page not found */}
            <Route
              path="/checkout/billing"
              element={<Navigate to="/billing" replace />}
            />

        </Route>

        {/* =========================
            AUTH ROUTES
        ========================= */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="userManagement"
            element={<UserManagement />}
          />

          <Route
            path="productManagement"
            element={<ProductManagement />}
          />

          <Route
            path="orderManagement"
            element={<OrdersManagement />}
          />

          <Route
            path="couponManagement"
            element={<AdminCupon />}
          />

          <Route
            path="options"
            element={<AdminOptions />}
          />

          <Route
            path="festivalBannerManagement"
            element={<FestivalBannerManagement />}
          />

          <Route 
            path="support"
            element={<SupportDashboardAdmin/>}
            />

          <Route
            path="categoryManagement"
            element={<CategoryManagement />}
          />

          <Route
            path="subCategoryManagement"
            element={<SubCategoryManagement />}
          />

          <Route
            path="brandManagement"
            element={<BrandManagement />}
          />

          <Route
            path="broadcast"
            element={<BroadcastCenter />}
          />

          <Route
            path="sent-emails"
            element={<SentEmails />}
          />

          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />
        </Route>

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requireAdmin>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* =========================
            FALLBACK
        ========================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;