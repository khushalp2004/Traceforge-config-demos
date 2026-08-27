import { FileText } from 'lucide-react';

interface EmptyStateProps {
  hasSearchQuery: boolean;
}

export const EmptyState = ({ hasSearchQuery }: EmptyStateProps) => {
  return (
    <div style={styles.container}>
      <div style={styles.iconWrapper}>
        <FileText size={48} style={styles.icon} />
      </div>
      <h3 style={styles.title}>
        {hasSearchQuery ? 'No matching notes found' : 'No notes yet'}
      </h3>
      <p style={styles.description}>
        {hasSearchQuery 
          ? "Try adjusting your search query to find what you're looking for."
          : "Click the 'Create Note' button to start capturing your thoughts."}
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center' as const,
    backgroundColor: 'var(--card-bg)',
    borderRadius: 'var(--radius-lg)',
    border: '1px dashed var(--card-border)',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  icon: {
    color: 'var(--text-muted)',
    opacity: 0.5,
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-color)',
    marginBottom: '0.5rem',
  },
  description: {
    color: 'var(--text-muted)',
    maxWidth: '400px',
    lineHeight: '1.6',
  }
};
