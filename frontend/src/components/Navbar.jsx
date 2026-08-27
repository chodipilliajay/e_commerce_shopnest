import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <circle cx="17" cy="19" r="10" fill="#FF6B4A" />
        <circle cx="10" cy="12" r="7" fill="#FFC857" />
        <circle cx="24" cy="12" r="7" fill="#34D399" />
      </svg>
      <span className="font-display text-xl font-700 text-ink">Shop<span className="text-brand">Nest</span></span>
    </Link>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/products?keyword=${encodeURIComponent(search.trim())}` : '/products');
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
        <Logo />

        <form onSubmit={handleSearch} className="relative hidden flex-1 max-w-lg md:block">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full rounded-full border border-ink/10 bg-white py-2.5 pl-11 pr-4 text-sm focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
          />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-soft" />
        </form>

        <nav className="ml-auto flex items-center gap-1 md:gap-2">
          <Link to="/products" className="btn-ghost hidden md:inline-flex">Shop</Link>

          <Link to="/cart" className="relative rounded-full p-2.5 hover:bg-ink/5" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-ink/5"
              >
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                <span className="hidden text-sm font-medium md:inline">{user.name.split(' ')[0]}</span>
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl2 border border-ink/5 bg-white py-2 shadow-card-hover">
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-ink/5"><User className="h-4 w-4" /> Profile</Link>
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-ink/5"><Package className="h-4 w-4" /> My Orders</Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-ink/5"><LayoutDashboard className="h-4 w-4" /> Admin Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-brand hover:bg-brand/5"><LogOut className="h-4 w-4" /> Logout</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary !px-5 !py-2 text-sm">Sign in</Link>
          )}

          <button className="rounded-full p-2.5 hover:bg-ink/5 md:hidden" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-ink/5 bg-paper px-4 py-3 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search products"
              className="w-full rounded-full border border-ink/10 bg-white py-2.5 pl-11 pr-4 text-sm"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-soft" />
          </form>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium">Shop All</Link>
        </div>
      )}
    </header>
  );
}
