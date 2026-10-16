// ============================================================================
// UNIT 3 - EXPERIMENT 1a: Header & Footer reusable functional components
// UNIT 3 - EXPERIMENT 3b: Link and NavLink for client-side navigation
// UNIT 5 - EXPERIMENT 2d: Progressive Web App (PWA) installation & service worker
// ============================================================================

import { Link, NavLink } from 'react-router-dom';
import { Compass, UserRound, LogOut, Menu, X, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  // [UNIT 5 - EXP 2d]: Listen for PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('%c[PWA: Ready to Install] beforeinstallprompt event captured', 'color: #0f766e; font-weight: bold;');
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      console.log('%c[PWA: Installed] App was successfully installed', 'color: #16a34a; font-weight: bold;');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Install prompt outcome: ${outcome}`);
      if (outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('PWA is ready! You can install Staywise using the install icon in your browser URL bar or via browser settings.');
    }
  };

  return (
    <>
      {/* [UNIT 3 - EXP 1a]: Header Navigation */}
      <header className="topbar">
        <div className="nav-shell">
          <Link to="/" className="brand">
            <span className="brand-mark"><Compass size={20} /></span>
            <span>stay<span>wise</span></span>
          </Link>

          <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X /> : <Menu />}
          </button>

          <nav className={open ? 'nav-links open' : 'nav-links'}>
            <NavLink to="/hotels" onClick={() => setOpen(false)}>Explore stays</NavLink>
            <NavLink to="/bookings" onClick={() => setOpen(false)}>My bookings</NavLink>

            {/* [UNIT 5 - EXP 2d]: Workable PWA Install Button */}
            {!installed && (
              <button
                className="button button-small button-ghost"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => { setOpen(false); triggerInstall(); }}
                title="Install Staywise as a progressive web app"
              >
                <Download size={14} /> Install App
              </button>
            )}

            {user ? (
              <button className="profile-link" onClick={() => { setOpen(false); logout(); }}>
                <LogOut size={16} /> Log out ({user.name})
              </button>
            ) : (
              <NavLink to="/login" className="profile-link" onClick={() => setOpen(false)}>
                <UserRound size={16} /> Sign in
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      {/* [UNIT 3 - EXP 1a]: Footer Component */}
      <footer>
        <div className="footer-shell">
          <div className="brand footer-brand">
            <span className="brand-mark"><Compass size={18} /></span>
            <span>stay<span>wise</span></span>
          </div>
          <span>Small stays. Big memories.</span>
          <span>Built with React, Redux Toolkit & REST patterns.</span>
        </div>
      </footer>
    </>
  );
}
