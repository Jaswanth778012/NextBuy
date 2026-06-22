
import React, { useState, useEffect, useRef } from 'react';
import userService from "../services/userService";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, notifyAuthChange } from '../hooks/useAuth';
import './Header.css';
import logo from '../assets/NestBuy.png';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn, role } = useAuth();
    const [profile, setProfile] = useState(null);
    console.log("Header User:", user);
console.log("Header dpUrl:", user?.dpUrl);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);
    const userMenuRef = useRef(null);
    const wishlistRef = useRef(null);

    // ✅ All hooks must run before any conditional return
    const isAdminPath = location.pathname.startsWith('/admin');
    const isAuthPath = location.pathname === '/login' || location.pathname === '/register';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
                setSearchQuery('');
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
            if (wishlistRef.current && !wishlistRef.current.contains(e.target)) {
                setWishlistOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current.focus(), 50);
        }
    }, [searchOpen]);

    useEffect(() => {
    const fetchProfile = async () => {
        try {
            const response = await userService.getMyProfile();
            setProfile(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoggedIn) {
        fetchProfile();
    }
}, [isLoggedIn]);

    // ✅ Conditional return AFTER all hooks
    if (isAdminPath || isAuthPath) return null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        notifyAuthChange();
        setUserMenuOpen(false);
        window.location.href = '/login';
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleProfileClick = () => {
        setUserMenuOpen(false);
        navigate('/profile');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

   const displayName =
   
    user?.username ||
    'User';
   console.log(user);
console.log(user?.dpUrl);

    const navLinks = [
        { label: 'New Arrival', path: '/products?sort=newest' },
        { label: 'Women', path: '/products?category=women' },
        { label: 'Men', path: '/products?category=men' },
        { label: 'Kids', path: '/products?category=kids' },
        { label: 'Beauty', path: '/products?category=beauty' },
    ];

    const isActive = (path) => location.search.includes(path.split('?')[1]) || location.pathname === path;

    return (
        <header className="site-header">
            <div className="header-glow"></div>
            
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <div className="logo-bloom">
                        <img src={logo} alt="NestBuy" className="logo-img" />
                    </div>
                    <span className="logo-text">NestBuy</span>
                </Link>

                <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    {navLinks.map(link => (
                        <Link
                            key={link.label}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-dot"></span>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="header-actions">
                    <div className={`search-inline-wrapper ${searchOpen ? 'open' : ''}`} ref={searchRef}>
                        {!searchOpen ? (
                            <button 
                                className="icon-btn search-toggle"
                                onClick={() => setSearchOpen(true)}
                                aria-label="Search"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.35-4.35"/>
                                </svg>
                            </button>
                        ) : (
                            <form className="search-inline-form" onSubmit={handleSearch}>
                                <svg className="search-inline-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.35-4.35"/>
                                </svg>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search products, brands..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button type="submit" className="search-inline-submit" aria-label="Search">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <button 
                                    type="button" 
                                    className="search-inline-close"
                                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                                    aria-label="Close search"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </form>
                        )}
                    </div>

                    <Link to="/cart" className="action-item cart-link" aria-label="Cart">
                        <div className="icon-btn cart-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                            <span className="cart-badge">0</span>
                        </div>
                    </Link>

                    {(!role || role?.toUpperCase() === "USER") && (
    <div className="action-item dropdown-wrapper" ref={wishlistRef}>
        <button
            className="icon-btn wishlist-toggle"
            onClick={() => setWishlistOpen(!wishlistOpen)}
            aria-label="Wishlist"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
        </button>

        {wishlistOpen && (
            <div className="dropdown-menu wishlist-menu">
                <div className="dropdown-header">Wishlist</div>

                <Link
                    to="/wishlist"
                    onClick={() => setWishlistOpen(false)}
                >
                    My Wishlist
                </Link>

                <Link
                    to="/wishlist/alerts"
                    onClick={() => setWishlistOpen(false)}
                >
                    Price Alerts
                </Link>
            </div>
        )}
    </div>
)}

                    {isLoggedIn && role?.toUpperCase() !== "ADMIN" ? (
                        <div className="action-item dropdown-wrapper user-menu-wrapper" ref={userMenuRef}>
                            <button 
                                className="user-pill-btn"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                               <div className="avatar-ring-sm">
  {profile?.dpUrl ? (
    <img
     src={profile.dpUrl}
      alt="Profile"
      className="avatar-sm-img"
    />
  ) : (
    <div className="avatar-sm">
      {getInitials(displayName)}
    </div>
  )}
</div>

<span className="user-name-sm">
  {displayName}
</span>
                                <svg 
                                    width="12" 
                                    height="12" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="3" 
                                    className={`chevron ${userMenuOpen ? 'open' : ''}`}
                                >
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </button>
                            
                            {userMenuOpen && (
                                <div className="dropdown-menu user-menu">
                                    <div className="dropdown-header">My Account</div>
                                    
                                    <button className="dropdown-link-btn" onClick={handleProfileClick}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        Profile
                                    </button>
                                    
                                    <Link to="/orders" className="dropdown-link-btn" onClick={() => setUserMenuOpen(false)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                            <line x1="3" y1="6" x2="21" y2="6"/>
                                            <path d="M16 10a4 4 0 0 1-8 0"/>
                                        </svg>
                                        My Orders
                                    </Link>
                                    
                                    <div className="dropdown-divider"></div>
                                    
                                    <button className="dropdown-logout" onClick={handleLogout}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                            <polyline points="16 17 21 12 16 7"/>
                                            <line x1="21" y1="12" x2="9" y2="12"/>
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="user-section guest">
                            <Link to="/login" className="btn-login-ghost">Login</Link>
                            <Link to="/register" className="btn-register-solid">Register</Link>
                        </div>
                    )}

                    <button 
                        className="mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menu"
                    >
                        <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>
            )}
        </header>
    );
};

export default Header;