import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile
from "./pages/AdminProfile";
import Products from "./pages/Products";

function AppRoutes() {
  const { theme } = useTheme();

  return (

    <BrowserRouter>

         <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/" element={<Home />} />
        <Route
  path="/admin/profile"
  element={<AdminProfile />}
/>
        <Route
          path="/admin/products"
          element={<Products />}
        />

      </Routes>

    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
