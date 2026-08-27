import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { useNotes } from '../hooks/useNotes';
import type { Note } from '../types/note';

import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { NoteCard } from '../components/NoteCard';
import { NoteForm } from '../components/NoteForm';
import { EmptyState } from '../components/EmptyState';

export const Home = () => {
  const { 
    notes, 
    isLoading, 
    searchQuery, 
    setSearchQuery, 
    createNote, 
    updateNote, 
    deleteNote 
  } = useNotes();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTimeout(() => setEditingNote(null), 300); // Wait for modal exit animation if any
  };

  const handleSaveNote = (title: string, content: string) => {
    if (editingNote) {
      updateNote(editingNote.id, { title, content });
      toast.success('Note updated successfully');
    } else {
      createNote(title, content);
      toast.success('Note created successfully');
    }
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      toast.success('Note deleted successfully');
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner" style={styles.spinner}></div>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading your notes...</p>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          .spinner { animation: spin 1s linear infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <Header />
      
      <div style={styles.controls}>
        <div style={{ flexGrow: 1 }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <button 
          onClick={async () => {
            // A very common real-world mistake: Assuming an API returns a specific structure 
            // and blindly accessing deeply nested properties that are undefined.
            const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
            const data: any = await response.json();
            
            // `data` has id, title, body, userId. It does NOT have `metadata`.
            // Accessing data.metadata.author.name will throw a TypeError!
            console.log(data.metadata.author.name);
          }} 
          style={{ ...styles.createBtn, backgroundColor: 'var(--danger-color)' }}
          className="create-btn"
        >
          <span style={styles.createBtnText}>Simulate API Bug</span>
        </button>

        <button 
          onClick={handleOpenCreate} 
          style={styles.createBtn}
          className="create-btn"
        >
          <Plus size={20} />
          <span style={styles.createBtnText}>Create Note</span>
        </button>
      </div>

      {notes.length === 0 ? (
        <EmptyState hasSearchQuery={searchQuery.trim().length > 0} />
      ) : (
        <div style={styles.grid}>
          {notes.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onEdit={handleOpenEdit} 
              onDelete={handleDeleteNote} 
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <NoteForm 
          note={editingNote} 
          onSave={handleSaveNote} 
          onClose={handleCloseForm} 
        />
      )}

      {/* Floating Action Button for mobile */}
      <button 
        onClick={handleOpenCreate} 
        style={styles.fab}
        className="fab-btn"
        aria-label="Create Note"
      >
        <Plus size={24} />
      </button>

      <style>{`
        .create-btn {
          transition: transform 0.2s, background-color 0.2s;
        }
        .create-btn:hover {
          transform: translateY(-2px);
          background-color: var(--primary-hover);
        }
        .fab-btn {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .fab-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5);
        }
        @media (max-width: 640px) {
          .create-btn span { display: none; }
          .create-btn { padding: 1rem; border-radius: 50%; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-color)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(59, 130, 246, 0.2)',
    borderTopColor: 'var(--primary-color)',
    borderRadius: '50%',
  },
  controls: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'flex-start',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    boxShadow: 'var(--shadow-sm)',
    whiteSpace: 'nowrap' as const,
  },
  createBtnText: {
    display: 'inline',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  fab: {
    position: 'fixed' as const,
    bottom: '2rem',
    right: '2rem',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    display: 'none', // Hidden on desktop, could show on mobile via media query, but keeping here for styling
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
    zIndex: 40,
  }
};
