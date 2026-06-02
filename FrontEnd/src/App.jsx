import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// =========================
// PAGES
// =========================

import Home from "./pages/Home";

import Login from "./pages/Login";

import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";

import AdminProfile from "./pages/AdminProfile";

import AdminOptions from "./pages/AdminOptions";
import UserManagement from "./pages/UserManegement";
<<<<<<< HEAD
import OrdersManagement from "./pages/OrdersManagement";
=======
import BroadcastCenter from "./pages/BroadcastCenter";
>>>>>>> c2d43ad618d0c43b469918ba4df4bcf89e7880b4

// =========================
// LAYOUTS
// =========================

import AdminLayout from "./layout/AdminLayout";
import SentEmails from "./pages/SentEmails";


function App() {
  return (
    <BrowserRouter>
      {/* TOAST */}

      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* ROUTES */}

      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* =========================
            ADMIN LAYOUT ROUTES
        ========================== */}

        <Route path="/admin" element={<AdminLayout />}>
          {/* DASHBOARD */}

          <Route path="dashboard" element={<AdminDashboard />} />

<<<<<<< HEAD
          <Route path="options" element={<AdminOptions/>}/>
          <Route path="userManagement" element={<UserManagement/>}/>
          <Route path="orderManagement" element={<OrdersManagement/>}/>
=======
          <Route path="options" element={<AdminOptions />} />
          <Route path="userManagement" element={<UserManagement />} />
>>>>>>> c2d43ad618d0c43b469918ba4df4bcf89e7880b4

          <Route path="broadcast" element={<BroadcastCenter />} />
          <Route path="sent-emails" element={<SentEmails/>}/>
          {/* DEFAULT ADMIN ROUTE */}

          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="/admin/profile" element={<AdminProfile />} />

        {/* =========================
            UNKNOWN ROUTE
        ========================== */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
