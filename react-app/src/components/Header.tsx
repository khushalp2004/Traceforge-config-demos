import { Moon, Sun, BookText } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.iconContainer}>
          <BookText size={24} color="white" />
        </div>
        <h1 style={styles.title}>Notes</h1>
      </div>
      <button 
        onClick={toggleTheme} 
        style={styles.themeToggle}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: 'var(--glass-bg)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--card-border)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  iconContainer: {
    backgroundColor: 'var(--primary-color)',
    padding: '0.5rem',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-md)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-color)',
    letterSpacing: '-0.025em',
  },
  themeToggle: {
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-color)',
    backgroundColor: 'var(--bg-color)',
    border: '1px solid var(--card-border)',
  }
} as const;
