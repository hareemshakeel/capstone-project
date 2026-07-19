import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Capstone
        </Link>

        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                Profile Settings
              </NavLink>
              <span className={styles.userEmail}>{user?.email}</span>
              <button type="button" className={styles.logoutBtn} onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={styles.navLink}>
                Log in
              </NavLink>
              <NavLink to="/register" className={styles.signUpBtn}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
