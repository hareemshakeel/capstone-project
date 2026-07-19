import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Manage your profile with ease</h1>
        <p>
          Update your email, phone number, date of birth, address, and password from a
          single settings page.
        </p>

        {isAuthenticated ? (
          <Link to="/settings" className={styles.cta}>
            Go to Profile Settings
          </Link>
        ) : (
          <div className={styles.actions}>
            <Link to="/register" className={styles.cta}>
              Get started
            </Link>
            <Link to="/login" className={styles.secondary}>
              Log in
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
