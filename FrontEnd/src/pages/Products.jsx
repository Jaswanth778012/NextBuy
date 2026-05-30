import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ProductList from '../components/adminDashboard/ProductList';

import '../styles/Products.css';

function Products() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'ADMIN') {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const handleGlobalSearch = (e) => {
    setSearchKeyword(e.target.value);
  };

  return (
    

      <div className="admin-main">
        

        <div className="admin-content">
          <ProductList searchKeyword={searchKeyword} />
        </div>
      </div>
    
  );
}

export default Products;
