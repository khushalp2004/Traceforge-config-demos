import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div style={styles.container}>
      <Search size={20} style={styles.icon} />
      <input
        type="text"
        placeholder="Search notes by title or content..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
      {value && (
        <button onClick={() => onChange('')} style={styles.clearBtn} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    marginBottom: '2rem',
  },
  icon: {
    position: 'absolute' as const,
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none' as const,
  },
  input: {
    width: '100%',
    padding: '1rem 3rem 1rem 3rem',
    fontSize: '1rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--card-border)',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-color)',
    transition: 'all 0.3s ease',
  },
  clearBtn: {
    position: 'absolute' as const,
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.25rem',
    borderRadius: '50%',
  }
};
