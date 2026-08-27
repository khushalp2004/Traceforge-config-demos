import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { Note } from '../types/note';

interface NoteFormProps {
  note?: Note | null;
  onSave: (title: string, content: string) => void;
  onClose: () => void;
}

export const NoteForm = ({ note, onSave, onClose }: NoteFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setError('');
    onSave(title.trim(), content.trim());
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="note-modal">
        <div style={styles.header}>
          <h2 style={styles.title}>{note ? 'Edit Note' : 'Create Note'}</h2>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close form">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              style={styles.input}
              autoFocus
            />
          </div>
          
          <div style={styles.formGroup}>
            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError('');
              }}
              style={styles.textarea}
            />
          </div>
          
          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn}>
              <Save size={16} />
              Save Note
            </button>
          </div>
        </form>

        <style>{`
          .note-modal {
            animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes modalSlideIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '1rem',
  },
  modal: {
    backgroundColor: 'var(--card-bg)',
    borderRadius: 'var(--radius-lg)',
    width: '100%',
    maxWidth: '600px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--card-border)',
    overflow: 'hidden',
  },
  header: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--card-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-color)',
  },
  closeBtn: {
    color: 'var(--text-muted)',
    padding: '0.4rem',
    borderRadius: 'var(--radius-md)',
  },
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  error: {
    color: 'var(--danger-color)',
    fontSize: '0.875rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  input: {
    fontSize: '1.125rem',
    fontWeight: '500',
  },
  textarea: {
    minHeight: '200px',
    resize: 'vertical' as const,
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    paddingTop: '0.5rem',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
    borderRadius: 'var(--radius-md)',
  },
  saveBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    fontWeight: '500',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }
};
