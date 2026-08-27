import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import type { Note } from '../types/note';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  return (
    <div style={styles.card} className="note-card">
      <div style={styles.header}>
        <h3 style={styles.title} title={note.title}>{note.title}</h3>
        <div style={styles.actions}>
          <button 
            onClick={() => onEdit(note)} 
            style={styles.actionBtn}
            aria-label="Edit note"
            className="action-edit"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDelete(note.id)} 
            style={{ ...styles.actionBtn, color: 'var(--danger-color)' }}
            aria-label="Delete note"
            className="action-delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p style={styles.content}>{note.content}</p>
      <div style={styles.footer}>
        <span style={styles.date}>
          Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
      </div>
      
      {/* Inline styles for hover effects */}
      <style>{`
        .note-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .note-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .action-edit:hover {
          color: var(--primary-color);
          background-color: var(--bg-color);
        }
        .action-delete:hover {
          color: var(--danger-hover) !important;
          background-color: var(--bg-color);
        }
      `}</style>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--card-bg)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    border: '1px solid var(--card-border)',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    height: '250px', // Fixed height for masonry-like grid predictability
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--text-color)',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    color: 'var(--text-muted)',
    padding: '0.4rem',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  content: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    flexGrow: 1,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 5,
    WebkitBoxOrient: 'vertical' as const,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
  },
  footer: {
    paddingTop: '1rem',
    borderTop: '1px solid var(--card-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  }
};
