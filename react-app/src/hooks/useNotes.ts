import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Note } from '../types/note';
import {
  getNotes,
  createNote as createNoteService,
  updateNote as updateNoteService,
  deleteNote as deleteNoteService
} from '../services/localStorageService';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate loading state to show smooth transitions
  useEffect(() => {
    const fetchNotes = () => {
      setIsLoading(true);
      try {
        const storedNotes = getNotes();
        setNotes(storedNotes);
      } catch (e) {
        console.error('Failed to load notes', e);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // 500ms simulated delay for aesthetic loading state
      }
    };
    
    fetchNotes();
  }, []);

  const createNote = useCallback((title: string, content: string) => {
    const newNote = createNoteService(title, content);
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    const updatedNote = updateNoteService(id, updates);
    if (updatedNote) {
      setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
    }
    return updatedNote;
  }, []);

  const deleteNote = useCallback((id: string) => {
    const success = deleteNoteService(id);
    if (success) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
    return success;
  }, []);

  const filteredNotes = useMemo(() => {
    let filtered = notes;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(lowerQuery) || 
        n.content.toLowerCase().includes(lowerQuery)
      );
    }
    // Sort by last updated descending
    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, searchQuery]);

  return {
    notes: filteredNotes,
    isLoading,
    searchQuery,
    setSearchQuery,
    createNote,
    updateNote,
    deleteNote
  };
};
