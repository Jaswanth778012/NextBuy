import React, { useState, useEffect } from 'react';
import ProductList from '../components/adminProduct/ProductList';

import '../styles/AdminProduct.css';

function Products() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

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
    

     <ProductList searchKeyword={searchKeyword} />
    
  );
}

export default Products;
