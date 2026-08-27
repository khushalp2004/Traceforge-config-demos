import type { Note } from '../types/note';
import { NOTES_STORAGE_KEY } from '../utils/constants';

export const getNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      throw new Error('Corrupted data: Expected array');
    }
    return parsed;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    // If corrupted, reset data to avoid breaking app loops
    localStorage.removeItem(NOTES_STORAGE_KEY);
    return [];
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save notes');
  }
};

export const createNote = (title: string, content: string): Note => {
  const notes = getNotes();
  const newNote: Note = {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
};

export const updateNote = (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>): Note | null => {
  const notes = getNotes();
  const index = notes.findIndex(n => n.id === id);
  
  if (index === -1) return null;
  
  notes[index] = {
    ...notes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveNotes(notes);
  return notes[index];
};

export const deleteNote = (id: string): boolean => {
  const notes = getNotes();
  const filtered = notes.filter(n => n.id !== id);
  
  if (filtered.length === notes.length) return false;
  
  saveNotes(filtered);
  return true;
};
